window.nextgenEditor.addPlugin('GravShortcodeCoreReadonly', {
  init() {
    this.editor.editing.view.document.on('keydown', (event, data) => {
      const { focus } = this.editor.model.document.selection;

      if (data.keystroke === 8) {
        if (focus.nodeBefore && focus.nodeBefore.isShortcode) {
          event.stop();
          return;
        }

        if (focus.parent.previousSibling && focus.parent.previousSibling.isShortcode) {
          event.stop();
          return;
        }

        // inline shortcodes
        if (focus.isAtStart && focus.parent.isShortcodeChildren) {
          event.stop();
          return;
        }

        // block shortcodes
        if (focus.parent.name === 'paragraph' && focus.parent.parent && focus.parent.parent.isShortcodeChildren && focus.parent.parent.childCount === 1 && focus.parent.childCount === 0) {
          this.editor.model.change((modelWriter) => {
            const modelShortcodeChildren = focus.parent.parent;
            const p = modelWriter.createElement('paragraph', { test: true });

            modelWriter.remove(focus.parent);
            modelWriter.append(p, modelShortcodeChildren);

            setTimeout(() => {
              this.editor.model.change((subModelWriter) => {
                subModelWriter.setSelection(subModelWriter.createPositionAt(p, 'end'));
              });
            });
          });

          event.stop();
          return;
        }
      }

      if (data.keystroke === 46) {
        if (focus.nodeAfter && focus.nodeAfter.isShortcode) {
          event.stop();
          return;
        }

        if (focus.parent.nextSibling && focus.parent.nextSibling.isShortcode) {
          event.stop();
          return;
        }

        // inline shortcodes
        if (focus.isAtEnd && focus.parent.isShortcodeChildren) {
          event.stop();
          return;
        }

        // block shortcodes
        if (focus.parent.name === 'paragraph' && focus.parent.parent && focus.parent.parent.isShortcodeChildren && focus.parent.childCount === 0) {
          event.stop();
          return;
        }
      }

      const selectedElement = this.editor.editing.view.document.selection.getSelectedElement();

      if (selectedElement && selectedElement.isReadOnly) {
        event.stop();
      }
    }, { priority: 'highest' });
  },
});
