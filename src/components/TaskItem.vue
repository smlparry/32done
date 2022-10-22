<template>
  <div class="flex items-start shadow-md shadow-lg p-3 rounded-md border mb-3">
    <button @click="completeTask" class="mr-2 mt-1">
      {{ task.complete ? "✅" : "⬜" }}
    </button>

    <editor-content class="grow" :editor="editor" />

    <div class="flex mt-1">
      <button @click="removeTask">✖️</button>
    </div>
  </div>
</template>

<script>
import { mutations } from "@/store/tasks";

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

export default {
  components: {
    EditorContent,
  },

  props: {
    task: { type: Object, required: true },
  },

  setup(props) {
    const editor = useEditor({
      content: `
        <h2>${props.task.title}</h2>
      `,
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
    });

    const completeTask = () => {
      mutations.updateTask({
        ...props.task,
        complete: !props.task.complete,
      });
    };

    const removeTask = () => mutations.removeTask(props.task);

    return {
      editor,
      completeTask,
      removeTask,
    };
  },
};
</script>

<style lang="scss">
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
