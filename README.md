# EasyCopyPaste Module Integration Guide

Starting from version 1.0.2, a separate branch has been created with the latest functional implementation for an easier integration process. This guide outlines the steps to smoothly incorporate this code into your tf2autobot instance without disrupting your entire codebase. You can find the branch [here](https://github.com/TryHardDo/tf2autobot/tree/easy-copy-paste-implementation)!

Please ensure that you have saved your ecosystem.json and files folder to prevent any data loss during the installation process.

‼️ Please save your `ecosystem.json` and `files` folder to make sure we don't lose any data ‼️

## Step 1:
- Navigate to the location of your autobot files, typically within the tf2autobot folder where your source and Git files are located.

## Step 2:
- Reset the code to its default source by executing the command: `git reset HEAD --hard && git pull --prune`. This action fetches the latest changes from the TF2autobot master branch.

## Step 3:
- Integrate the changes from the forked repository into your Git remotes. Run the command: `git remote add tryharddo https://github.com/TryHardDo/tf2autobot.git`.

## Step 4:
- Fetch all changes from the newly added remote with the command: `git fetch tryharddo`. This action retrieves the necessary information from GitHub.

## Step 5:
- Merge the implementation branch into your existing codebase using the command: `git merge tryharddo/easy-copy-paste-implementation`. After the completion of this command, your codebase will include all the required changes.

## Step 6:
- Install any new dependencies that were introduced during the merge by running: `npm i`. This step ensures that all necessary dependencies are installed or updated.

## Step 7:
- Rebuild the sources of your bot to incorporate the fresh code by executing: `npm run` build.

## Step 8:
- Your bot is now ready for operation. However, you need to add a placeholder to your `options.json` file. Refer to the [autobot wiki](https://github.com/TF2Autobot/tf2autobot/wiki/Configure-your-options.json-file#-listing-note-settings-) to locate the appropriate settings object. Insert the following placeholder `%easy_copy_paste%` anywhere within the note text.

## Step 9:
- Save everything and boot up the bot and let's start trading again!
