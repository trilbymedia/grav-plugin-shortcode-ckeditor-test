import { reservedAttributes, createModelShortcode } from './converters';

const Command = window.ckeditor5.classes.core.command.class;

window.ckeditor5.addPlugin('GravShortcodeCoreCommand', {
  init() {
    Object.values(window.ckeditor5.shortcodes).forEach((shortcode) => {
      const commandName = `shortcode_${shortcode.name}`;

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
            const viewItem = new DOMParser().parseFromString('<div/>', 'text/html').body.firstChild;

            Object.keys(shortcode.attributes).forEach((attrName) => {
              const newAttrName = reservedAttributes.includes(attrName)
                ? `data-${attrName}`
                : attrName;

              viewItem.setAttribute(newAttrName.toLowerCase(), shortcode.attributes[attrName].default.value);
            });

            if (shortcode.parent) {
              const firstPosition = selection.getFirstPosition();

              if (firstPosition.parent.isShortcodeChildren || (firstPosition.parent.parent && firstPosition.parent.parent.isShortcodeChildren)) {
                const parentShortcodeData = firstPosition.parent.shortcodeData || (firstPosition.parent.parent && firstPosition.parent.parent.shortcodeData) || null;

                viewItem.parent = new DOMParser().parseFromString('<div/>', 'text/html').body.firstChild;
                viewItem.parent.shortcodeParent = parentShortcodeData.modelShortcode;

                viewItem.parent.shortcodeParentAttributes = Object.keys(parentShortcodeData.shortcode.attributes).reduce((acc, attrName) => {
                  acc[attrName] = parentShortcodeData.modelShortcode.getAttribute(`sc-${attrName}`);
                  return acc;
                }, {});
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
