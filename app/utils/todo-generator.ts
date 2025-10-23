export interface TodoItem {
  name: string;
  duration: string;
  priority: string;
  deadline?: string;
  frequency?: string;
}

export interface TodoData {
  goal: string;
  criteria: string;
  deadline: string;
  currentStatus: string;
  gap: string;
  obstacles: string;
  todos: TodoItem[];
  encouragement: string;
}

export const generateMarkdown = (data: TodoData): string => {
  const now = new Date().toLocaleDateString('ja-JP');
  
  return `# 目標達成プラン

## 📋 基本情報
- **目標**: ${data.goal}
- **達成基準**: ${data.criteria}
- **期限**: ${data.deadline}
- **作成日**: ${now}

## 📊 現状分析
- **現在の状況**: ${data.currentStatus}
- **ギャップ**: ${data.gap}
- **障害・課題**: ${data.obstacles}

## ✅ Todoリスト

${data.todos.map((todo, index) => 
  `### ${index + 1}. ${todo.name}
- **所要時間**: ${todo.duration}
- **優先度**: ${todo.priority}
${todo.deadline ? `- **期日**: ${todo.deadline}` : ''}
${todo.frequency ? `- **頻度**: ${todo.frequency}` : ''}
`).join('\n')}

## 💪 先輩からのひとこと
${data.encouragement}

---
*このプランは ${now} に作成されました。*
`;
};

export const downloadMarkdown = (content: string, filename: string = 'todo-list.md') => {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
