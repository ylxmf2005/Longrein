import React, { useState } from 'react';
import { Box, Text, render, useApp, useInput } from 'ink';
import { Skill } from '../core/skills.js';
import { Target, TargetId } from '../core/paths.js';
import { EXTENSION_COMPONENTS, ExtensionComponent } from '../core/recommended-extension.js';

interface TargetPickerProps {
  targets: Target[];
  onDone: (selected: TargetId[] | null) => void;
}

function TargetPicker({ targets, onDone }: TargetPickerProps) {
  const { exit } = useApp();
  const [cursor, setCursor] = useState(0);
  const [checked, setChecked] = useState<Set<TargetId>>(() => new Set(targets.map((target) => target.id)));

  useInput((input, key) => {
    if (key.upArrow || input === 'k') {
      setCursor((current) => (current + targets.length - 1) % targets.length);
    } else if (key.downArrow || input === 'j') {
      setCursor((current) => (current + 1) % targets.length);
    } else if (input === ' ') {
      const id = targets[cursor].id;
      setChecked((previous) => {
        const next = new Set(previous);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    } else if (input === 'a') {
      setChecked(new Set(targets.map((target) => target.id)));
    } else if (input === 'n') {
      setChecked(new Set());
    } else if (key.return) {
      onDone(targets.map((target) => target.id).filter((id) => checked.has(id)));
      exit();
    } else if (key.escape || (key.ctrl && input === 'c') || input === 'q') {
      onDone(null);
      exit();
    }
  });

  const descriptions: Record<TargetId, string> = {
    codex: 'Skills and instructions',
    claude: 'Skills and instructions',
    pi: 'Skills and instructions',
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="cyan">Choose hosts</Text>
        <Text dimColor> — space toggle · enter confirm · q cancel</Text>
      </Box>
      {targets.map((target, index) => {
        const active = index === cursor;
        const selected = checked.has(target.id);
        return (
          <Box key={target.id}>
            <Text color={active ? 'cyan' : undefined}>{active ? '> ' : '  '}</Text>
            <Text color={selected ? 'green' : 'gray'}>{selected ? '[x]' : '[ ]'}</Text>
            <Text bold={active}> {target.label.padEnd(14)}</Text>
            <Text dimColor>{descriptions[target.id]}</Text>
          </Box>
        );
      })}
      <Box marginTop={1}>
        <Text dimColor>{checked.size}/{targets.length} selected</Text>
      </Box>
    </Box>
  );
}

export function pickTargets(available: Target[]): Promise<TargetId[] | null> {
  return new Promise((resolve) => {
    const app = render(<TargetPicker targets={available} onDone={resolve} />);
    void app.waitUntilExit();
  });
}

interface PickerProps {
  skills: Skill[];
  mode: string;
  onDone: (selected: string[] | null) => void;
}

function Picker({ skills, mode, onDone }: PickerProps) {
  const { exit } = useApp();
  const [cursor, setCursor] = useState(0);
  const [checked, setChecked] = useState<Set<string>>(() => new Set(skills.map((s) => s.name)));

  useInput((input, key) => {
    if (key.upArrow || input === 'k') {
      setCursor((c) => (c + skills.length - 1) % skills.length);
    } else if (key.downArrow || input === 'j') {
      setCursor((c) => (c + 1) % skills.length);
    } else if (input === ' ') {
      const name = skills[cursor].name;
      setChecked((prev) => {
        const next = new Set(prev);
        if (next.has(name)) next.delete(name);
        else next.add(name);
        return next;
      });
    } else if (input === 'a') {
      setChecked(new Set(skills.map((s) => s.name)));
    } else if (input === 'n') {
      setChecked(new Set());
    } else if (key.return) {
      onDone(skills.map((s) => s.name).filter((n) => checked.has(n)));
      exit();
    } else if (key.escape || (key.ctrl && input === 'c') || input === 'q') {
      onDone(null);
      exit();
    }
  });

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="cyan">
          longrein install
        </Text>
        <Text dimColor> — {mode} · space toggle · a all · n none · enter confirm · q cancel</Text>
      </Box>
      {skills.map((skill, i) => {
        const active = i === cursor;
        const isChecked = checked.has(skill.name);
        return (
          <Box key={skill.name}>
            <Text color={active ? 'cyan' : undefined}>{active ? '❯ ' : '  '}</Text>
            <Text color={isChecked ? 'green' : 'gray'}>{isChecked ? '◉' : '◯'}</Text>
            <Text bold={active}> {skill.name.padEnd(14)}</Text>
            <Text dimColor>{skill.description.slice(0, 64)}</Text>
          </Box>
        );
      })}
      <Box marginTop={1}>
        <Text dimColor>
          {checked.size}/{skills.length} selected
        </Text>
      </Box>
    </Box>
  );
}

export function pickSkills(skills: Skill[], mode: string): Promise<string[] | null> {
  return new Promise((resolve) => {
    const app = render(<Picker skills={skills} mode={mode} onDone={resolve} />);
    void app.waitUntilExit();
  });
}

interface ExtensionPickerProps {
  defaultSelected: boolean;
  onDone: (components: ExtensionComponent[] | null) => void;
}

const extensionDescriptions: Record<ExtensionComponent, string> = {
  codegraph: 'Code structure and call paths',
  cass: 'Local coding-session search CLI',
  'cass-skill': 'Agent workflow for cass',
  fastctx: 'Structured files, search and shell',
};

function ExtensionPicker({ defaultSelected, onDone }: ExtensionPickerProps) {
  const { exit } = useApp();
  const [cursor, setCursor] = useState(0);
  const [selected, setSelected] = useState<Set<ExtensionComponent>>(
    () => new Set(defaultSelected ? EXTENSION_COMPONENTS : []),
  );

  useInput((input, key) => {
    if (key.upArrow || input === 'k') {
      setCursor((current) => (current + EXTENSION_COMPONENTS.length - 1) % EXTENSION_COMPONENTS.length);
    } else if (key.downArrow || input === 'j') {
      setCursor((current) => (current + 1) % EXTENSION_COMPONENTS.length);
    } else if (input === ' ') {
      const component = EXTENSION_COMPONENTS[cursor];
      setSelected((previous) => {
        const next = new Set(previous);
        if (next.has(component)) next.delete(component);
        else next.add(component);
        return next;
      });
    } else if (input === 'a') {
      setSelected(new Set(EXTENSION_COMPONENTS));
    } else if (input === 'n') {
      setSelected(new Set());
    } else if (key.return) {
      onDone(EXTENSION_COMPONENTS.filter((component) => selected.has(component)));
      exit();
    } else if (key.escape || (key.ctrl && input === 'c') || input === 'q') {
      onDone(null);
      exit();
    }
  });

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="cyan">Optional Extension</Text>
        <Text dimColor> — space toggle · a all · n none · enter confirm · q cancel</Text>
      </Box>
      {EXTENSION_COMPONENTS.map((component, index) => {
        const active = cursor === index;
        const checked = selected.has(component);
        return (
          <Box key={component}>
            <Text color={active ? 'cyan' : undefined}>{active ? '> ' : '  '}</Text>
            <Text color={checked ? 'green' : 'gray'}>{checked ? '[x]' : '[ ]'}</Text>
            <Text bold={active}> {component.padEnd(12)}</Text>
            <Text dimColor>{extensionDescriptions[component]}</Text>
          </Box>
        );
      })}
      <Box marginTop={1}>
        <Text dimColor>{selected.size}/{EXTENSION_COMPONENTS.length} selected</Text>
      </Box>
    </Box>
  );
}

export function pickExtensionComponents(defaultSelected = false): Promise<ExtensionComponent[] | null> {
  return new Promise((resolve) => {
    const app = render(<ExtensionPicker defaultSelected={defaultSelected} onDone={resolve} />);
    void app.waitUntilExit();
  });
}
