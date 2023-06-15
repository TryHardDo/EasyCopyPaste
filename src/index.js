"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
class EasyCopyPaste {
    constructor(mapFileName, mapFileLocation) {
        this.mapFileName = mapFileName;
        this.mapFileLocation = mapFileLocation;
        this.specialDelimiters = [`'`, `-`, `/`, `.`];
    }
    /**
     * Method to convert items to easy copy paste string.
     * If it is an exceptional item with special delimeter(s) in it's name
     * we map the item to be back convertable and save it to a file where the special
     * item names are located.
     *
     * If the item does not have special delimeter just spaces we wont save the item since it is
     * easily reverseable.
     * @param str The plain item name
     * @returns The parsed item name string
     */
    toEasyCopyPasteString(str) {
        if (str.length === 0) {
            throw new Error("The input string's length must be greater than 0!");
        }
        return this.mapString(str);
    }
    /**
     * Method to convert easy copy paste string back to the item's original format.
     * If the item is in the special mapped item names we will return the stored original name.
     *
     * If the item is not in the special item names mape we just replace the underscores to spaces.
     * @param str The easy copy paste string
     * @returns The original item name
     */
    fromEasyCopyPasteString(str) {
        if (str.length === 0) {
            throw new Error("The input string's length must be greater than 0!");
        }
        return this.reverseMapString(str);
    }
    findMappedValue(str, mappedItems) {
        const lowerStr = str.toLowerCase();
        return mappedItems.find((item) => {
            return (lowerStr === item.itemName.toLowerCase() ||
                lowerStr === item.mappedName.toLowerCase());
        }) || null;
    }
    reverseMapString(str) {
        const storedMap = this.loadMapData();
        const found = this.findMappedValue(str, storedMap);
        if (found !== null) {
            return found.itemName;
        }
        return str.replace(/_/g, ' ');
    }
    mapString(str) {
        const storedMap = this.loadMapData();
        const found = this.findMappedValue(str, storedMap);
        if (found !== null) {
            return found.mappedName;
        }
        let shouldSave = false;
        const easyDelimiter = '_';
        const strArr = str.split('');
        for (let i = 0; i < strArr.length; i++) {
            let char = strArr[i];
            if (this.specialDelimiters.includes(char)) {
                // If the next character is a space, replace current character with nothing
                if (strArr[i + 1] === ' ') {
                    strArr[i] = '';
                }
                else {
                    strArr[i] = easyDelimiter;
                }
                shouldSave = true;
            }
            if (char === ' ') {
                strArr[i] = easyDelimiter;
            }
        }
        const mapped = {
            itemName: str,
            mappedName: strArr.join('')
        };
        if (shouldSave) {
            storedMap.push(mapped);
            this.saveMapData(storedMap);
        }
        return mapped.mappedName;
    }
    saveMapData(mappedItems) {
        try {
            fs_1.default.mkdirSync(this.mapFileLocation, { recursive: true });
            const json = JSON.stringify(mappedItems);
            fs_1.default.writeFileSync((0, path_1.join)(this.mapFileLocation, this.mapFileName), json, { flag: 'w+' });
        }
        catch (err) {
            console.error('An error occurred while saving map data:', err);
        }
    }
    loadMapData() {
        try {
            const rawData = fs_1.default.readFileSync((0, path_1.join)(this.mapFileLocation, this.mapFileName), { encoding: 'utf-8', flag: 'r' });
            const obj = JSON.parse(rawData.length === 0 ? '[]' : rawData);
            if (obj) {
                return obj;
            }
        }
        catch (err) {
            const nodeErr = err;
            if (nodeErr.code === 'ENOENT') {
                console.log('File does not exist. Creating new file.');
                this.saveMapData(new Array());
            }
            else {
                console.error('An unexpected error occurred:', nodeErr);
            }
        }
        return new Array();
    }
}
exports.default = EasyCopyPaste;
