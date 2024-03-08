/**
 * @function 元素滚动到底部
 */
export const scrollToBottom = (element: Element | null) => {
    if (element) {
        element.scrollTop = element.scrollHeight;
    }
};

/**
 * @function 移除元素
 */
export const removeElement = (element: Element | null) => {
    if (element) {
        element.remove();
    }
};

/**
 * @function 递归找到DOM下最后一个元素节点
 */
const findLastElement = (element: Element): Element | null => {
    // 如果该DOM没有子元素，则返回自身
    if (!element.children.length) {
        return element;
    }
    const lastChild = element.children[element.children.length - 1];
    // 如果最后一个子元素是元素节点，则递归查找
    if (lastChild.nodeType === Node.ELEMENT_NODE) {
        return findLastElement(lastChild as HTMLElement);
    }
    return element;
};

/**
 * @function 插入光标元素
 */
export const insertCursor = (target: Element | null, insertedElement: string) => {
    if (!target) {
        return;
    }
    // 获取最后一个子元素节点
    let lastChild: Element | null = target.lastElementChild || target;
    // 如果是pre标签，就在pre标签中找到class为hljs的元素
    if (lastChild.tagName === 'PRE') {
        lastChild = lastChild.getElementsByClassName('hljs')[0] || lastChild;
    }
    // 兼容是ul标签的情况，找到OL标签内部的最后一个元素
    if (lastChild.tagName === 'OL') {
        lastChild = findLastElement(lastChild as HTMLElement);
    }
    lastChild?.insertAdjacentHTML('beforeend', insertedElement);
};
