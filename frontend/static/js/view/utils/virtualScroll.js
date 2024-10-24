// virtualScroll.js
export function virtualScroll(updateItemsDTO, paneSideElement, visibleItemCount) {
    let start = 0;
    let end = visibleItemCount;
    
    const onScroll = () => {
        const scrollTop = paneSideElement.scrollTop;
        const newStart = Math.max(Math.floor(scrollTop / 72) - 1, 0);
        const newEnd = newStart + visibleItemCount;
        
        if (newStart !== start || newEnd !== end) {
            start = newStart;
            end = newEnd;
            updateItems(updateItemsDTO, start, end);
        }
    };

    paneSideElement.removeEventListener("scroll", onScroll);
    paneSideElement.addEventListener("scroll", onScroll);

}


export function updateItems(updateItemsDTO, newStart, newEnd) {
    const itemsToUpdate = updateItemsDTO.itemsToUpdate.filter(item => {
        const translateY = parseInt(item.style.transform.replace("translateY(", "").replace("px)", ""));
        const index = translateY / 72;
        return (index < newStart || index >= newEnd);
    });
    itemsToUpdate.forEach(item => updateItemsDTO.removeEventListeners(item));
    itemsToUpdate.forEach((item, idx) => {
        const translateY = parseInt(item.style.transform.replace("translateY(", "").replace("px)", ""));
        const index = Math.floor(translateY / 72);
        const newIndex = (index < newStart) ? (newEnd - 1 - idx) : (newStart + idx);
        const listItem = updateItemsDTO.list[newIndex];
        if (listItem && !('about' in listItem)) {
            console.log(listItem)
            item.data = listItem;
            const time = listItem.lastMessageTime;
            console.log(time)
            // const date = new Date(time);
            // const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const nameSpan = item.querySelector(".name-span");
            const timeSpan = item.querySelector(".time");
            const messageSpan = item.querySelector(".message-span-span");

            nameSpan.textContent = listItem.friendEmail;
            timeSpan.textContent = time;
            messageSpan.textContent = listItem.lastMessage;
            console.log(listItem.lastMessage)

            item.style.transform = `translateY(${newIndex * 72}px)`;
        }
        if (listItem && ('about' in listItem)) {
            const nameSpan = item.querySelector(".name-span");
            item.contactData = listItem
            const messageSpan = item.querySelector(".message-span-span");
            nameSpan.textContent = listItem.userContactName;
            if (messageSpan) {
                messageSpan.textContent = listItem.about;
            }
            item.dataset.user = listItem.userContactName
            item.style.transform = `translateY(${newIndex * 72}px)`;

        }
    });
    itemsToUpdate.forEach(item => updateItemsDTO.addEventListeners(item));
}



export class UpdateItemsDTO {
    constructor({
        list = [],
        itemsToUpdate = [],
        removeEventListeners = () => { },
        addEventListeners = () => { }
    } = {}) {
        this.list = list;
        this.itemsToUpdate = itemsToUpdate;
        this.removeEventListeners = removeEventListeners;
        this.addEventListeners = addEventListeners;
    }
}