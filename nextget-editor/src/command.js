import { reservedAttributes, createModelShortcode } from './converters';

const Command = window.nextgenEditor.classes.core.command.class;

window.nextgenEditor.addPlugin('GravShortcodeCoreCommand', {
  init() {
    Object.values(window.nextgenEditor.shortcodes).forEach((shortcode) => {
      const commandName = `shortcode-${shortcode.name}`;

      class GravShortcodeCoreCommand extends Command {
        refresh() {
          const { selection } = this.editor.model.document;

          this.value = false;

          if (shortcode.type === 'block') {
            this.isEnabled = true;
          }

          if (shortcode.type === 'inline') {
            this.isEnabled = selection.rangeCount === 1 && selection.getFirstRange().isFlat;
          }
        }

        execute() {
          this.editor.model.change((modelWriter) => {
            const { selection } = this.editor.model.document;
            const viewItem = document.createElement('div');

            Object.keys(shortcode.attributes).forEach((attrName) => {
              const newAttrName = reservedAttributes.includes(attrName)
                ? `data-${attrName}`
                : attrName;

              viewItem.setAttribute(newAttrName.toLowerCase(), shortcode.attributes[attrName].default.value);
            });

            if (shortcode.parent) {
              const firstPosition = selection.getFirstPosition();

              if (firstPosition.parent.isShortcodeChildren || (firstPosition.parent.parent && firstPosition.parent.parent.isShortcodeChildren)) {
                const { modelShortcode } = firstPosition.parent.shortcodeData || firstPosition.parent.parent.shortcodeData;
                const viewParent = document.createElement('div');

                Object.keys(shortcode.parent.attributes).forEach((attrName) => {
                  viewParent.setAttribute(attrName, modelShortcode.getAttribute(`sc-${attrName}`));
                });

                viewParent.appendChild(viewItem);
              }
            }

            const modelShortcode = createModelShortcode(this.editor, shortcode, modelWriter, viewItem);

            const { shortcodeData } = modelShortcode;
            const { modelShortcodeChildren } = shortcodeData;

            if (shortcode.type === 'block') {
              const ranges = [];
              const blocks = [...selection.getSelectedBlocks()];
              let startPosition;

              blocks.forEach((block, index) => {
                const nextBlock = blocks[index + 1];

                if (!startPosition) {
                  startPosition = modelWriter.createPositionBefore(block);
                }

                if (!nextBlock || block.nextSibling !== nextBlock) {
                  ranges.push(modelWriter.createRange(startPosition, modelWriter.createPositionAfter(block)));
                  startPosition = null;
                }
              });

              if (shortcode.type === 'block' && (!selection.hasOwnRange || !blocks.length) && modelShortcodeChildren.name !== 'paragraph' && modelShortcodeChildren.childCount === 0 && modelShortcodeChildren.name !== 'p_empty') {
                modelWriter.append(modelWriter.createElement('paragraph'), modelShortcodeChildren);
              }

              let insertPosition = selection.getLastPosition();

              if (blocks.length) {
                insertPosition = modelWriter.createPositionAfter(blocks[blocks.length - 1]);
              }

              if (!selection.hasOwnRange) {
                insertPosition = modelWriter.createPositionAt(this.editor.model.document.getRoot(), 0);
              }

              modelWriter.insert(modelShortcode, insertPosition);

              if (selection.hasOwnRange) {
                if (modelShortcodeChildren.name !== 'p_empty') {
                  ranges.forEach((range) => {
                    modelWriter.move(range, modelShortcodeChildren, 'end');
                  });
                } else {
                  ranges.forEach((range) => modelWriter.remove(range));
                }
              }
            }

            if (shortcode.type === 'inline') {
              modelWriter.insert(modelShortcode, selection.getLastPosition());
              modelWriter.move(selection.getFirstRange(), modelShortcodeChildren, 'end');
              modelWriter.insertText('\u200b', modelShortcode, 'before');
              modelWriter.insertText('\u200b', modelShortcode, 'after');
            }

            if (selection.isCollapsed) {
              modelWriter.setSelection(modelShortcodeChildren, 'in');
            }
          });
        }
      }

      this.editor.commands.add(commandName, new GravShortcodeCoreCommand(this.editor));
    });
  },
});
