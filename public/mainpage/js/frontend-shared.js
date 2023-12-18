const subTabContents = document.querySelectorAll('[class^="midsubtab-"]');
const tabContents = document.querySelectorAll('#menu-mid > div');
const tabButtons = document.querySelectorAll(".mid-tabbutton");
const lsideButtons = document.querySelectorAll(".lside-button");

tabButtons.forEach(button => {
    button.addEventListener("click", () => {
        const tabValue = button.getAttribute("tab");

        tabButtons.forEach(_button => {
            _button.removeAttribute("state");
        });

        button.setAttribute("state", "active");

        subTabContents.forEach(content => {
            content.hidden = true;
        });

        const selectedTabContent = document.querySelector(`.midsubtab-${tabValue}`);
        if(selectedTabContent) selectedTabContent.hidden = false;
    });
});

lsideButtons.forEach(lsideButton => {
    lsideButton.addEventListener("click", function () {
        const tabValue = lsideButton.getAttribute("tab");

        lsideButtons.forEach(_button => {
            _button.removeAttribute("state");
        });

        document.querySelectorAll("#dm-list > div").forEach(_dm => {
            _dm.removeAttribute("state");
        });

        lsideButton.setAttribute("state", "active");

        tabContents.forEach(content => {
            content.hidden = true;
        });

        const selectedTabContent = document.querySelector(`.midtab-${tabValue}`);
        if(selectedTabContent) selectedTabContent.hidden = false;
    });
});