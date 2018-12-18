import { addFlag } from './adventure.jsx';

// flags are basically just fancy global variables
// it sets it as global, and when you update it in the
// console it also refreshes the screen.

// you can use regular variables if you want, but then
// you dont get the two benefits above (not a huge deal)

// items
addFlag("key", false);
addFlag("hasFishingPole", false);
addFlag("hasLookedAroundInShop", false);

// counters
addFlag("money", 100);
addFlag("iphone", 0);

// export scenes (the hot reloader does some magic with this)
export default {
    // start, the game always starts on the scene called 'start'
    // this is probably one of the most complex scenes due to most actions
    // being done on this scene.
    start: {
        // prompt, return a function OR a string with what you want it to say.
        // i recommend using a function so you can add dynamic stuff and html formatting
        prompt: () => <div>
            You are in the world

            {
                ( money == 0 ) ?
                (
                    <span> without any money, thats bad. </span>
                ):(
                    <span> with {money} money. </span>
                )
            }
            
            What do you do?
        </div>,
        // the options are the list of things you can do
        options: [
            // simple option
            {text: "Go inside the shop", to: "shop"},
            {text: "Go to the pond.", to: "pond"},
            // this one has an if property, the item will only show up IF the function returns true
            {text: "Use Key", to: "usedKey", if: () => key },
            // this one uses an if property AND an 'action' property. action() is called when the option
            // is chosen
            {
                text: "Buy iPhone",
                to: "start",
                if: () => money >= 20,
                action: () => {
                    money = money - 20;
                    iphone++;
                }
            },
        ]   
    },
    // pond area
    pond: {
        prompt: `
            The average pond, maybe if you had a fishing pole you could go fishing.
        `,
        options: [
            { text: "Leave", to: "start" },
            { text: "Go Fish", to: "fishing", if: () => hasFishingPole },
        ]
    },
    // the shop
    shop: {
        prompt: `
            You go in the shop, seems pretty active. Wonder what they are selling.
        `,
        options: [
            { text: "Leave", to: "start" },
            { text: "Look around", to: "shop_look_around" },
            { text: "See whats for sale", to: "shop_list_items" },
            // this one only shows if youve looked around the room, and not taken the key
            { text: "Pickup Key", to: "pickUpKey", if: () => hasLookedAroundInShop && !key },
        ]
    },
    shop_look_around: {
        // you can use regular functions also, returning strings
        prompt: () => {
            if(key) {
                return "You look around, a very active shop."
            } else {
                return "You look around, and notice a key sitting in the corner of the room."
            }
        },
        options: [
            { text: "Okay", to: "shop" },
        ],
        // action is called when a scene is shown.
        action: () => {
            hasLookedAroundInShop = true;
        }
    },
    shop_list_items: {
        prompt: () => <div>
            {
                (hasFishingPole) ? "The shop is all sold out." : "There is a fishing pole for sale ($75)."
            }
            {
                (money <= 0) ? (" You are out of money.") : (" You have " + money + " money.")
            }
        </div>,
        options: [
            { text: "Leave", to: "shop" },
            { text: "Purchase fishing pole.", to: "shop_list_items", if: () => (money >= 75 && !hasFishingPole), action: () => {
                money -= 75;
                hasFishingPole = true;
            }},
        ],
    },
    pickUpKey: {
        prompt: `
            You got the key.
        `,
        action: ()=> {
            key = true;
        },
        options: [
            { text: "Okay", to: "shop" },
        ]
    },
    usedKey: {
        prompt: `
            Are you sure you want to continue to the next area.
        `,
        options: [
            { text: "Yes, continue...", to: "theend" },
            { text: "No, I'm not ready yet", to: "start" },
        ]
    },
    theend: {
        prompt: () => <div>
            <p>
                That's the end of the Text Adventure Engine demo, hope you haved fun.
            </p>
            <p>
                More stuff available at <a href="https://davecode.me">davecode.me</a>.
            </p>
        </div>,
        options: []
    },
    fishing: {
        prompt: "You try to fish in the pond, but there aren't any fish in the pond.",
        options: [
            { text: "Okay", to: "pond" },
        ]
    }
    // end shop
}