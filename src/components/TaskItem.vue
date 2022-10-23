<template>
  <div
    :class="[
      'task-item flex items-start shadow-md shadow-lg rounded-md border-2 mb-3 bg-white cursor-grab transition-opacity transition-transform',
      { 'p-2 hover:opacity-100': index > 2 },
      { 'mb-10': index === 2 },
      { '--priority mb-6 p-4': index <= 2 },
      {
        'border-green-500 shadow-none': task.status === STATUS.COMPLETED,
      },
    ]"
    :style="{ 'animation-delay': `${index * 0.08}s` }"
  >
    <button @click="() => mutations.toggleComplete(task)" class="mr-2 mt-1">
      {{
        task.status === STATUS.COMPLETED
          ? "✅"
          : task.status === STATUS.MOVED_FORWARD
          ? "➡️️"
          : "⬜"
      }}
    </button>

    <editor-content class="cursor-auto" :editor="editor" />

    <div class="flex mt-1 grow justify-end">
      <button class="mr-2" @click="() => mutations.moveToNextDay(task)">
        ➡️️
      </button>
      <button @click="() => mutations.removeTask(task)">✖️</button>
    </div>
  </div>
</template>

<script>
import { STATUS, mutations } from "@/store/tasks";

import debounce from "@/lib/debounce";

import { useEditor, EditorContent } from "@tiptap/vue-3";

import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Placeholder from "@tiptap/extension-placeholder";
import History from "@tiptap/extension-history";

const CustomDocument = Document.extend({
  content: "heading block*",
});

const defaultTaskContent = (task) => `<h2>${task.title}</h2>`;

export default {
  components: {
    EditorContent,
  },

  props: {
    task: { type: Object, required: true },
    index: { type: Number, required: true },
  },

  setup(props) {
    const handleEditorUpdate = () => {
      const html = editor.value.getHTML();

      const title = html.substring(
        html.indexOf("<h2>") + 4,
        html.lastIndexOf("</h2>")
      );

      mutations.updateTask({
        ...props.task,
        title,
        content: html,
      });
    };

    const completeTask = () => {
      mutations.updateTask({
        ...props.task,
        complete: !props.task.complete,
      });
    };

    const removeTask = () => mutations.removeTask(props.task);

    const editor = useEditor({
      content:
        props.task.content && props.task.content.length
          ? props.task.content
          : defaultTaskContent(props.task),

      // Disable drop: https://github.com/ueberdosis/tiptap/issues/706#issuecomment-1018523772
      editorProps: {
        handleDOMEvents: {
          drop: (_, e) => {
            e.preventDefault();
          },
        },
      },

      extensions: [
        CustomDocument,
        Text,
        Paragraph,
        TaskItem.configure({
          nested: true,
          draggable: true,
        }),
        TaskList,
        History,
        Heading.configure({
          levels: [2, 3, 6],
        }),
        Placeholder.configure({
          showOnlyCurrent: false,
          placeholder: ({ node }) => {
            if (node.type.name === "heading") {
              return "Task Title";
            }

            return "Can you add some further context?";
          },
        }),
      ],

      onUpdate: () => {
        debounce(handleEditorUpdate, 500);
      },
    });

    return {
      editor,
      mutations,
      completeTask,
      removeTask,
      STATUS,
    };
  },
};
</script>

<style lang="scss">
.task-item {
  animation: fadeInUp 0.3s ease-in-out forwards;
  opacity: 0;

  &.--priority {
    animation: fadeInUp--priority 0.3s ease-in-out forwards;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(16px);
  }
}

@keyframes fadeInUp--priority {
  from {
    opacity: 0;
    transform: translateY(16px) scale(1);
  }

  to {
    opacity: 1;
    transform: translateY(16px) scale(1.1);
  }
}

.ProseMirror-focused {
  outline: none;
}

/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.5em;
  }

  li {
    display: flex;
    label {
      margin-right: 4px;
    }
  }

  > *:last-child {
    margin-bottom: 0.5rem;
  }

  > *:first-child {
    margin-bottom: 0rem;
  }
}

.ProseMirror .is-empty::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
</style>
