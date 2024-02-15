![image](https://github.com/Futur3Sn0w/plusUI/assets/18166632/49c1b259-262c-4c0a-aec3-aa2b37d9b9f8)  
# PlusUI (Codename: WebNT)
PlusUI is my ever-evolving, multi-year long project to create a hybrid dashboard & smart display for large-format screens that is both beautiful, and multi-functional. PlusUI looks best on larger screens, but it's made to scale properly on all screen sizes.  
This project was hand-written from the ground up in pure HTML/CSS/JS (vanilla jQuery), with exception of plugins not created by me.  
The name PlusUI is from it's large-screen nature, and it's codename (WebNT) is a mix of web for it's web-based nature, and NT for both "new technology" and "new tab", as the project originated as a new-tab replacement.  

Read below for more information and usage.  
**IMPORTANT:** 
 - PlusUI is in active development.
 - Images shown below may show older version/builds of PlusUI. 
 - Features and appearances may be changed or removed at any time.

### tvOS meets VisionOS
The first thing you'll notice about PlusUI is its Apple-inspired UI. All the user elements, from the shelf, to the card deck, to the control panel are heavily inspired by Apple's and design elements and guidelines. It takes the most inspiration from the tvOS home screen, although everything is tweaked and refined to work a bit better with different input types.  

![image](https://github.com/Futur3Sn0w/plusUI/assets/18166632/102ae4df-9237-4d38-b966-cd3e08cf2d82)  
  
Aside from just being blurry, the UI also saturates the color behind it, making it change and adapt based on your backdrop. Whether you have expandables open, or just want to view the background, PlusUI always looks gorgeous on your screen.  

![image](https://github.com/Futur3Sn0w/plusUI/assets/18166632/14c9042e-2a71-45c0-af25-db6fd89ba905)  

### Refreshingly New
PlusUI's layout resembles that of the tvOS home screen, but with some unique changes and additions. The time is always in the top right, and the shelf is always at the bottom. Clicking the time opens control panel, and next to it is the 'card deck' button, which is hidden while the control panel is open. When you first arrive at the home page, you're greeted with your name (customizable from control panel), and a badge in the top-left with PlusUI's version number. You can view the version badge at any time from control panel.  
Behind the UI is the 'backdrop' area, which shows either an image slideshow, or static website (see "backdrop").  

![image](https://github.com/Futur3Sn0w/plusUI/assets/18166632/98bfc4c2-8788-4684-8e86-55de93827c81)  

### The Shelf & Cards
The main interaction point of PlusUI is the shelf at the bottom of the screen, which holds small widgets called 'cards'. PlusUI's cards can display a glimpse of information, or act as a visual identifier for a link or action on the web. Information on the card is dynamic, and updates & saves in real time. Cards vary in size, shape, and appearance, as well as functionality; some cards are interactive, while others just display information.  

![image](https://github.com/Futur3Sn0w/plusUI/assets/18166632/b36ad33f-6e25-4263-9912-9ce22f5a0452)  


To access options for a card, you can right-click or tap and hold to open the context menu. Not all cards have the same options, and some may have specific options available only on that card.  

Default Options             |  Custom Options
:-------------------------:|:-------------------------:
![image](https://github.com/Futur3Sn0w/plusUI/assets/18166632/b01e6f40-85c9-4156-bc0c-f10ac5fc6225)  |  ![image](https://github.com/Futur3Sn0w/plusUI/assets/18166632/4a20cf5b-dd4b-460d-ba01-450c6fd2e53e)

Edit mode allows you to change the order of cards, so you don't accidentally move a card while otherwise interacting with it. Drag and release the card in edit mode to rearrange its position in the shelf.  

![image](https://github.com/Futur3Sn0w/plusUI/assets/18166632/1c274daf-fff4-4d26-90cd-f53d648f245b)  


### Expandables
Some cards have an option to pop them out into a window (accessible via context menu). These cards are known as 'expandables', and their windows are known as the 'expanded view'.  
Expandables allow you to view even more information that won't fit in the shelf card view. Expandables can be moved around with the grabber at the bottom, and can be returned to the dock by selecting the smaller dot to the left of the move grabber. The height of each window varies, but the width will always stay the same. Expandables may include interactive or otherwise hidden information that may not be visible in the card's shelf view.

![image](https://github.com/Futur3Sn0w/plusUI/assets/18166632/5fb18b38-0c9c-4126-bdc0-1f962a1372e8)

### Card deck (Codename: Rolodex)
The card deck stores cards that have been removed from the shelf. New cards developed for PlusUI will be added to the deck instead of directly to the shelf. Any and every card can be moved to and from the deck, and the state of a card moved to the deck will remain for later.  
The deck displays an extended description of the current card, as well as the option to add it. Available cards can be browsed in the carousel with the left/right buttons. To move a card to the deck, use the relevant option in the card's context menu.  

![image](https://github.com/Futur3Sn0w/plusUI/assets/18166632/76abe504-e501-48b8-a327-88e7c901b623)  

### Control Panel
PlusUI's control panel hosts a range of options to tweak PlusUI to your liking. You can open it at any time by clicking the time in the top-right corner. Control panel can host multiple panes, which can be switched between via the page buttons that appear when control panel is open.  

![image](https://github.com/Futur3Sn0w/plusUI/assets/18166632/bae894c9-6357-44d2-b42f-30d4d97dc213)  

Here's a list of appearance & user options (as of v2.5) from left-to-right, top-to-bottom:  
 - **Theme**  
   Change the theme of the UI and cards to light or dark themes, or make the site match your system setting.  

Dark Theme             |  Light Theme
:-------------------------:|:-------------------------:
![SCR-20240213-qkwy](https://github.com/Futur3Sn0w/plusUI/assets/18166632/942a4367-1879-4268-9d30-cae632671988)  |  ![SCR-20240213-qkuu](https://github.com/Futur3Sn0w/plusUI/assets/18166632/6b410965-4724-4470-b26f-6fd9adeee215)

 - **Mono mode**  
   Also known as "plated view". Intelligently removes color from cards to create a uniform appearance. Inspired by macOS Sonoma's monochrome widget style.
 - **Floating cards**  
   Also known as "ambient mode". Makes the shelf background fill and blur the bottom of the display and increases card spacing. Great for touchscreens.
 - **Shelf alignment**  
   Choose which side of the display to align the shelf to. Touchscreen users can also swipe either left or right to align the dock without opening control panel.
 - **Fullscreen**  
   Allow PlusUI to fill the full width and height of your display without windowchrome or other OS elements interrupting. Great for casting/TVs.
 - **Reload**  
   PlusUI not running well? Try reloading the page! Helpful when in fullscreen.
 - **? (x2)**  
   (Undecided)
 - **User Name**  
   Enter a name or nickname for PlusUI to greet you with whenever you visit the page. (Defaults to 'user' if left blank)

### Backdrop
PlusUI comes with a built-in 'backdrop' feature that can display different images/media as the background of the page, which will fade in or out based on what you're doing. To see the full view of any backdrop, click the expand button in control panel to open it in a new tab.  

The backdrop can be customized via it's page in control panel, and both options comes with settings to choose from:
 - Unsplash Random  
   Rotate through thousands of free stock images on Unsplash.  
   - You can filter what kind of images are displayed with the filter box (separate filters with commas).  
   - Automatically switches every 60 seconds, or whenever you open PlusUI.  
   - Manually switch images by clicking the reload button.

![image](https://github.com/Futur3Sn0w/plusUI/assets/18166632/5f6bc9a3-4287-420f-b4cf-a2d6b5a5d29c)  

 - "Live Display"  
   Use any website or otherwise embeddable content as the background of PlusUI.  
   - Set any supported webpage as the backdrop by pasting in the link and hitting enter.
   - Choose from a list of preset sites that will make your PlusUI pop!
   - Interact with the site only while control panel is open.
   - Refresh the selected page with the reload button.
   
![image](https://github.com/Futur3Sn0w/plusUI/assets/18166632/e3da7a1b-13f8-40c5-b36b-d6dab3c48787)  

## Tips, tricks, and fun(?) facts
This section will be more unorganized, but I'll leave some usage notes and such of PlusUI!  

 - **Tip:** On touchscreens, you can swipe the dock left or right to move it in that direction
 - **Tip:** While an expandable is open, click the chevron in the card's placeholder on the shelf to close the expanded view
 - **Fun fact:** The earliest iteration of PlusUI was technically a watered-down RSS reader. The background was black, and there were no options, just a grey box with a few blocks of text!

~ ~
