import EasyCopyPaste from './EasyCopyPaste';

const easyCopyPaste = new EasyCopyPaste('mappedNames.json', './files')

const exampleItemName = 'Strange Shotgun';
console.log('Input item: ' + exampleItemName);

easyCopyPaste.toEasyCopyPasetString(exampleItemName).then(str => {
    console.log('Mapped: ' + str);

    easyCopyPaste.fromEasyCopyPasteString(str).then(rmp => {
        console.log('Re-mapped: ' + rmp);
    })
});
