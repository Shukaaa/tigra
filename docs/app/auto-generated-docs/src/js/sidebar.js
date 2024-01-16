// Default Script to initialize the sidebar
// Feel free to customize or remove as needed

document.addEventListener("DOMContentLoaded", () => {
    const contentContainer = document.getElementById("content-container");
    const sidebarElement = createSidebar(contentContainer);

    contentContainer.parentElement.appendChild(sidebarElement);
});

function createSidebar(contentContainer) {
    const sidebarElement = document.createElement("nav");
    sidebarElement.id = "sidebar";
    sidebarElement.classList.add("sidebar");

    const sidebarOrder = getSidebarOrder(contentContainer);

    for (const sidebarElementSettings of sidebarOrder) {
        const sidebarElementElement = createSidebarElement(sidebarElementSettings);
        sidebarElement.appendChild(sidebarElementElement);
    }

    return sidebarElement;
}

function getSidebarOrder(contentContainer) {
    const sidebarOrder = [];

    let currentH1, currentH2;

    for (const contentElement of contentContainer.children) {
        if (contentElement.tagName === "H1") {
            currentH1 = {
                title: contentElement.innerText,
                id: contentElement.id,
                children: [],
            };
            sidebarOrder.push(currentH1);
        } else if (contentElement.tagName === "H2") {
            currentH2 = {
                title: contentElement.innerText,
                id: contentElement.id,
                children: [],
            };
            currentH1.children.push(currentH2);
        } else if (contentElement.tagName === "H3") {
            currentH2.children.push({
                title: contentElement.innerText,
                id: contentElement.id,
                children: [],
            });
        }
    }

    return sidebarOrder;
}

function createSidebarElement(sidebarElement) {
    const sidebarElementLink = document.createElement("a");
    sidebarElementLink.innerText = sidebarElement.title;
    sidebarElementLink.href = "#" + sidebarElement.id;

    const sidebarElementElement = document.createElement("div");
    sidebarElementElement.classList.add("sidebar-element");
    sidebarElementElement.appendChild(sidebarElementLink);

    if (sidebarElement.children.length > 0) {
        const sidebarElementChildren = document.createElement("div");
        sidebarElementChildren.classList.add("sidebar-element-children");
        for (const sidebarElementChild of sidebarElement.children) {
            const childElement = createSidebarElement(sidebarElementChild);
            sidebarElementChildren.appendChild(childElement);
        }
        sidebarElementElement.appendChild(sidebarElementChildren);
    }

    return sidebarElementElement;
}
