# EasyCopyPaste Module Integration Guide

Follow these steps to integrate the `EasyCopyPaste` module into your project:

## Step 1: Install the Module
Add the module to your project using npm:
```shell
npm i https://github.com/TryHardDo/EasyCopyStrings.git
```

## Step 2: Create a Helper Class
Create a `Helper` class in `./src/lib/helpers.ts` and import the required module:

```typescript
import EasyCopyPaste from 'easycopypaste';
```

Then, use the following code or modify it according to your needs:

```typescript
export default class Helper {
    private readonly ecp = new EasyCopyPaste();

    public getEasyCopyPasteStr(itemName: string, intent: 'buy' | 'sell'): string {
        let intentStr = '';
        if (intent === 'buy') {
            intentStr = 'sell_';
        } else {
            intentStr = 'buy_';
        }

        const easyCopyPasteString = this.ecp.toEasyCopyPasteString(itemName);

        return `${intentStr}${easyCopyPasteString}`;
    }

    public getNormalizedItemName(easyCopyPasteString: string): string {
        return this.ecp.fromEasyCopyPasteString(easyCopyPasteString);
    }
}
```

Copy the above code to the end of helpers.ts.

## Step 3: Import Helper Class to Bot.ts

Add the `Helper` class import to `Bot.ts`:

```typescript
import Helper from '../lib/helpers';
```

Add it [HERE](https://github.com/TF2Autobot/tf2autobot/blob/722502bf25dd5590e058cb5b2d26554bfa11aa3a/src/classes/Bot.ts#LL20C1-L20C1).

## Step 4: Add 'helper' Field to Bot.ts

In `Bot.ts`, add a field called 'helper' which type is `Helper`:

```typescript
readonly helper: Helper;
```

Add it [HERE](https://github.com/TF2Autobot/tf2autobot/blob/722502bf25dd5590e058cb5b2d26554bfa11aa3a/src/classes/Bot.ts#LL177C1-L177C1).

## Step 5: Assign a New Instance of the Helper Class in the Bot's Constructor

Assign a new instance of the `Helper` class in the Bot's constructor to the 'helper' field which was created in Step 4. For example:
```typescript
this.helper = new Helper();
```

Add it [HERE](https://github.com/TF2Autobot/tf2autobot/blob/722502bf25dd5590e058cb5b2d26554bfa11aa3a/src/classes/Bot.ts#LL193C1-L193C1).

## Step 6: Implement the Rest to Listings.ts and Commands.ts

Now our singleton is ready. Let's implement the rest to Listings.ts and Commands.ts.
To include the easy copy-paste string in our listing notes, add this line of code to Listings.ts. Since the file already has the import of the Bot class, no additional imports are necessary.

Go to [THIS](https://github.com/TF2Autobot/tf2autobot/blob/722502bf25dd5590e058cb5b2d26554bfa11aa3a/src/classes/Listings.ts#LL652C13-L652C20) location and replace the code frag to this:

```typescript
return details
	  .replace(/%price%/g, isShowBoldOnPrice ? boldDetails(price, style) : price)
    .replace(/%name%/g, entry.id ?? entry.name)
	  .replace(/%easy_copy_paste%/g, this.bot.helper.getEasyCopyPasteStr(entry.name, key)) // Get easy copy paste placeholder
    .replace(/%max_stock%/g, isShowBoldOnMaxStock ? boldDetails(maxStock, style) : maxStock)
    .replace(/%current_stock%/g, isShowBoldOnCurrentStock ? boldDetails(currentStock, style) : currentStock)
    .replace(/%amount_trade%/g, isShowBoldOnAmount ? boldDetails(amountTrade, style) : amountTrade);
```

## Step 7: Add Command Handler in Commands.ts
The listing part is ready. Now we add the command handler part which triggers an instant buy or sell action in the bot's logic.

Go to the following location: [Commands.ts](https://github.com/TF2Autobot/tf2autobot/blob/722502bf25dd5590e058cb5b2d26554bfa11aa3a/src/classes/Commands/Commands.ts#LL107C1-L107C1).

Add the following code frag to the exact location. If you add somewhere else it won't work.

```typescript
if (message.startsWith('buy_')) {
    this.buyOrSellCommand(
        steamID,
        this.bot.helper.getNormalizedItemName(message.replace('buy_', '')),
        'buy' as Instant,
        null
    );
    return;
}

if (message.startsWith('sell_')) {
    this.buyOrSellCommand(
        steamID,
        this.bot.helper.getNormalizedItemName(message.replace('sell_', '')),
        'sell' as Instant,
        null
    );
    return;
}
```

## Step 8: Compile the Code
We need to compile the code for the changes to take effect. You can simply do that if you open a CMD in the same location as package.json of the bot and execute the following:
```shell
npm run build
```

## Step 9: Update Bot Configuration
Let's add the new placeholder in the bot configuration. Refer to the [wiki](https://github.com/TF2Autobot/tf2autobot/wiki/Configure-your-options.json-file#-listing-note-settings-) for the exact location of the settings.

For example a sell note would look like this with easy copy-paste placeholder:
`"I am selling my %name% for %price%, I am selling %amount_trade%. (double-click & Ctrl + C) \"%easy_copy_paste%\""`

## Step 10: Deploy Your Changes and enjoy
Save everything and now it should work!

# Note
If you encounter any issue regarding to the tutorial or the package itself please open an Issue and descripe the problem.
I will try to fix it as soon as I can.
