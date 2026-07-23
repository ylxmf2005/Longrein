import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

interface Connection {
  client: Client;
  transport: StdioClientTransport;
}

const extensionDir = path.dirname(fileURLToPath(import.meta.url));
const serverEntry = path.resolve(extensionDir, '../../../cli/dist/mcp-entry.js');

async function openConnection(): Promise<Connection> {
  if (!fs.existsSync(serverEntry)) {
    throw new Error(`Longrein MCP entry is missing: ${serverEntry}. Rebuild or reinstall Longrein.`);
  }
  const client = new Client({ name: 'longrein-pi', version: '0.1.0' }, { capabilities: {} });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverEntry],
    stderr: 'pipe',
  });
  await client.connect(transport);
  return { client, transport };
}

export default async function longreinPiExtension(pi: ExtensionAPI) {
  // Discover tool contracts from the same MCP server used by every supported host.
  // This keeps Pi's schemas aligned without maintaining a second contract source.
  const discovery = await openConnection();
  const listed = await discovery.client.listTools();
  await discovery.client.close();

  let connection: Connection | null = null;
  let connecting: Promise<Connection> | null = null;

  const ensureConnection = async (): Promise<Connection> => {
    if (connection) return connection;
    if (!connecting) {
      connecting = openConnection().then((opened) => {
        connection = opened;
        opened.transport.onclose = () => {
          if (connection === opened) connection = null;
        };
        return opened;
      });
    }
    try {
      return await connecting;
    } finally {
      connecting = null;
    }
  };

  for (const tool of listed.tools) {
    pi.registerTool({
      name: tool.name,
      label: tool.title ?? tool.name,
      description: tool.description ?? tool.name,
      promptSnippet: tool.description,
      parameters: tool.inputSchema as any,
      executionMode: 'sequential',
      async execute(_toolCallId, params, signal, _onUpdate, ctx) {
        const active = await ensureConnection();
        const sessionFile = ctx.sessionManager.getSessionFile();
        const sessionName = ctx.sessionManager.getSessionName();
        const metadata = Object.fromEntries(
          Object.entries({
            session_id: ctx.sessionManager.getSessionId(),
            transcript_path: sessionFile,
            title: sessionName,
            cwd: ctx.cwd,
          }).filter(([, value]) => value !== undefined && value !== null && value !== ''),
        );
        let result;
        try {
          result = await active.client.callTool(
            {
              name: tool.name,
              arguments: params as Record<string, unknown>,
              _meta: { 'x-pi-turn-metadata': metadata },
            },
            undefined,
            { signal },
          );
        } catch (error) {
          await active.client.close().catch(() => undefined);
          if (connection === active) connection = null;
          throw error;
        }
        const text = result.content
          .filter((item): item is Extract<(typeof result.content)[number], { type: 'text' }> => item.type === 'text')
          .map((item) => item.text)
          .join('\n');
        if (result.isError) throw new Error(text || `${tool.name} failed`);
        return {
          content: [{ type: 'text', text: text || JSON.stringify(result.structuredContent ?? {}) }],
          details: { structuredContent: result.structuredContent },
        };
      },
    });
  }

  pi.on('session_shutdown', async () => {
    if (connection) await connection.client.close().catch(() => undefined);
    connection = null;
  });
}
