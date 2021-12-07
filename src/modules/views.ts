/*
    Ascii art
        and CLI view generation
            -Highlander
 */
const TAG = " | App | ";
const chalk = require("chalk");
const figlet = require("figlet");
const log = require("loggerdog-client")();


export function showWelcome() {
    let tag = TAG + " | importConfig | ";
    try {
        console.info(
            chalk.blue(`%c
            lcdOXWMMMMMMMMMMMMMMMMMMMMMMMMMMMMNKOdcd
            :  .';lx0NWMMMMMMMMMMMMMMMMMMNKOdc,'.  l
            o..dxl;'.':oxOOOOOOOOOOOOOkdc,..,:oko..k
            O..xWMWXOo. ..''''''''''''. .ckKNWMNo.,K
            X: cNMMMKl..o0XXXXXXXXXXXKx,.;kNMMMX; lN
            Wo ,KMNk,.:0WMMMMMMMMMMMMMMXd..c0WMO..kM
            MO..xKc..dNMMMMMMMMMMMMMMMMMW0c..dKo ,KM
            MX; .'.:0WMMMMMMMMMMMMMMMMMMMMNk,... lNM
            MWo   .:llllllllllllllllllllllll:.  .xWM
            MNl    .;::::::::::::::::::::::,.   .xWM
            MO..::..cONMMMMMMMMMMMMMMMMMWXx;.'l; ;KM
            X: :XW0l'.;kNMMMMMMMMMMMMMWKd'.,dXWO'.dW
            x..kWMMWKd,.,dKWMMMMMMMMW0l..:kNMMMNl ,K
            : .;ldk0XNXk;..l0WMMMMNk:..cONNK0xoc' .x
            Kd:.   ..,:ll:. .:k00x,..,coc;'.    'ckX
            MMWKxc.   .,,'..   ..   ..',,.  .'lkXWMM
            MMMMMWXkl'.'lkOko'    ;dOOxc'.,oONMMMMMM
            MMMMMMMMMXk:..cdc.    .ld:..cONMMMMMMMMM
            MMMMMMMMMMMW0l.          'oKWMMMMMMMMMMM
            MMMMMMMMMMMMMWKl.      .oXMMMMMMMMMMMMMM
            MMMMMMMMMMMMMMMW0c.  .lKWMMMMMMMMMMMMMMM
            MMMMMMMMMMMMMMMMMNo,;dNMMMMMMMMMMMMMMMMM
            `),
                    'color: #3761F9; font-size: 12px; font-family: monospace'
        )
        log.info('\n',
            chalk.blue(figlet.textSync("ShapeShift-cli", {horizontalLayout: "full"}))
        );
        log.debug(
        );
        log.debug(
            " \n A simple Multi-Coin Wallet and explorer CLI      \n \n                        ---Highlander \n "
        );
    } catch (e) {
        console.error(tag, "e: ", e);
        return {};
    }
}
