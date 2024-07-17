export function virtualScroll(updateItemsDTO, paneSideElement, visibleItemCount) {
    let start = 0;
    let end = visibleItemCount;

    paneSideElement.addEventListener("scroll", () => {
        const scrollTop = paneSideElement.scrollTop;
        const newStart = Math.max(Math.floor(scrollTop / 72) - 1, 0);
        const newEnd = newStart + visibleItemCount;

        if (newStart !== start || newEnd !== end) {
            start = newStart;
            end = newEnd;
            updateItems(updateItemsDTO, start, end);
        }
    });

}


export function updateItems(updateItemsDTO ,newStart, newEnd) {
    const itemsToUpdate = updateItemsDTO.itemsToUpdate.filter(item => {
            const translateY = parseInt(item.style.transform.replace("translateY(", "").replace("px)", ""));
            const index = translateY / 72;
            console.log("index: ", index, " newStart: ", newStart, " newEnd: ", newEnd);
            return (index < newStart || index >= newEnd);
        });
        itemsToUpdate.forEach((item, idx) => {
        const translateY = parseInt(item.style.transform.replace("translateY(", "").replace("px)", ""));
        const index = Math.floor(translateY / 72);
        const newIndex = (index < newStart) ? (newEnd - 1 - idx) : (newStart + idx);
        const listItem = updateItemsDTO.list[newIndex];

        if (listItem && !('about' in listItem)) {
            console.log(listItem)
            updateItemsDTO.removeChatEventListeners(item);
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
            item.style.zIndex = newIndex;
            updateItemsDTO.addChatEventListeners(item);
        }
        if (listItem && ('about' in listItem)) {
            updateItemsDTO.removeChatEventListeners(item);
            item.data = listItem;
            const nameSpan = item.querySelector(".name-span");
            const messageSpan = item.querySelector(".message-span-span");

            nameSpan.textContent = listItem.friendEmail;
            messageSpan.textContent = item.about;

            item.style.transform = `translateY(${newIndex * 72}px)`;
            item.style.zIndex = newIndex;
            updateItemsDTO.addChatEventListeners(item);

        }
    });
}



export class UpdateItemsDTO {
    constructor({
        list = [],
        itemsToUpdate = [],
        removeChatEventListeners = () => {},
        addChatEventListeners = () => {}
    } = {}) {
        this.list = list;
        this.itemsToUpdate = itemsToUpdate;
        this.removeChatEventListeners = removeChatEventListeners;
        this.addChatEventListeners = addChatEventListeners;
    }
}