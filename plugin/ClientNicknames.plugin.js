//META{"name":"ClientNicknames"}*//

function ClientNicknames() {
    ///////////////
    // Meta Data //
    ///////////////

    this.getName = () => {
        return "Client Nicknames";
    };

    this.getDescription = () => {
        return "Client Side Nicknames so you don't forget who that person is!"
            + "<br>Contact <i>Natsulus#5647</i> via DM or on the #plugin channel of the Better Discord server.";
    };

    this.getVersion = () => {
        return "0.7.0";
    };

    this.getAuthor = () => {
        return "Natsulus";
    };

    //////////
    // Main //
    //////////

    this.start = () => {
        this.detectRightClick(true);

        this.settings = this.manageSettings("load");
        this.createSettingsPanel();

        // Add Tab Bar Button when Enabling
        if ($("form.form.settings.user-settings-modal").length > 0) {
            $(".tab-bar.SIDE").first().append(this.settingsButton);
            $(".form .settings-right .settings-inner").last().after(this.settingsPanel);
        }

        // this.loadScript("https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js", "jQuery-Easing");
        console.info("[Client Nicknames] Enabling Plugin");
    };

    this.stop = () => {
        this.detectRightClick(false);
        $(".cnick-pane, .cnick-tab, .cnick-tab-bar-item").remove();

        //this.settingsButton.hide();
        console.info("[Client Nicknames] Disabling Plugin");
    };

    this.observer = ev => {
        if (ev.addedNodes.length === 1) {
            if (ev.target.getAttribute("class") && ev.target.classList.contains("flex-spacer")
                && (ev.target.classList.contains("flex-horizontal") || ev.target.classList.contains("flex-vertical"))) {
                // Custom onSwitch (includes Friend List /channels/@me)
                //
            } else if ($(ev.target).find("form.form.settings.user-settings-modal").length > 0) {
                // User Settings Opened
                this.settingsPanel.hide();

                $(".tab-bar.SIDE .tab-bar-item:not(#bd-settings-new)").click(() => {
                    $(".form .settings-right .settings-inner").first().show();
                    $("#cnick-settings-new").removeClass("selected");
                    this.settingsPanel.hide();
                });

                const tabBarSide = $(".tab-bar.SIDE").first();
                const tabBarSet = setInterval(() => {
                    const bdtab = $("#bd-settings-new");

                    if (bdtab.length > 0) {
                        clearInterval(tabBarSet);
                        tabBarSide.append(this.settingsButton);
                        $("#cnick-settings-new").removeClass("selected");
                        bdtab.click(() => {
                            $("#cnick-settings-new").removeClass("selected");
                            this.settingsPanel.hide();
                        });
                    }
                });

                $(".form .settings-right .settings-inner").last().after(this.settingsPanel);
                $("#cnick-settings-new").removeClass("selected");
            } else if (ev.addedNodes[0].classList && ev.addedNodes[0].classList.contains("context-menu") && !ev.target.classList.contains("item-subMenu")) {
                // Context Menu Made
                const options = ["Change Nickname", "Mute", "Add Friend", "Remove Friend", "Block"];
                const items = $(ev.addedNodes).find("div.item-group div.item");
                let selector;

                for (const opt of options) {
                    selector = items.filter((index, element) => {return $(element).text() === opt;});

                    if (selector.length > 0) {
                        return opt.indexOf("Friend") !== -1 || opt === "Block"
                            ? selector.before(this.attachContextButton())
                            : selector.after(this.attachContextButton());
                    }
                }
            } /*else if (ev.addedNodes[0].childNodes.length === 2) {
                if (ev.addedNodes[0].childNodes[0].nodeName === "DIV" && (/avatars/).test(ev.addedNodes[0].childNodes[0].style.backgroundImage)) {
                    let selector;
                    const id = ev.addedNodes[0].childNodes[0].style.backgroundImage.match(/\/(\d{10,})\//)[1];

                    if (/channel-members/.test(ev.target.className)) {
                        // Modify on new member in list (scrolling)
                        // Does not apply on start
                        selector = $(`.channel-members .avatar-small[style*="${id}"] + .member-inner .member-username .member-username-inner`);
                        //console.log(selector);
                        //console.log(selector.text());
                    } else if (/scroller messages/.test(ev.target.className)) {
                        // Modify on new message
                        selector = $(`.message-group .avatar-large[style*="${id}"] + .comment .user-name`);
                        //console.log(selector.first().text());
                    }
                    // Use onSwitch to modify on channel and server switch
                }
            }*/
        }
    };

    //////////
    // Core	//
    //////////

    this.createSettingsPanel = () => {
        // Create Panel
        this.settingsPanel = $("<div>", {
            id: "cnick-pane",
            class: "settings-inner",
            css: {display: "none"}
        });

        let list;
        const content = {};
        const scroller = $("<div>", {class: "scroller-wrap"});
        const settings = $("<div>", {class: "scroller settings-wrapper settings-panel"});
        const tabs = $("<div>", {class: "tab-bar TOP"});
        const panes = $("<div>", {class: "cnick-settings"});

        // Settings //
        tabs.append($("<div>", {
            class: "tab-bar-item cnick-tab",
            id: "cnick-settings-tab",
            text: "Settings",
            click: ev => {
                ev.stopImmediatePropagation();
                this.changeTab("cnick-settings");
            }
        }));

        content.settings = {};

        list = $("<ul>", {class: "checkbox-group cnick-checkbox-group"});

        for (const setting in this.settings.server) {
            // list.append("whateva shiz")
            console
                .log(setting);
        }

        content.settings.server = $("<div>", {class: "control-groups"}).append($("<div>", {class: "control-group"})
            .append($("<label>", {
                style: "margin-bottom: 12px",
                text: "Server"
            })).append(list));

        list = $("<ul>", {class: "checkbox-group cnick-checkbox-group"});

        for (const setting in this.settings.group) {
            console
                .log(setting);
        }

        content.settings.group = $("<div>", {class: "control-groups"}).append($("<div>", {class: "control-group"})
            .append($("<label>", {
                style: "margin-bottom: 12px",
                text: "Group"
            })).append(list));

        list = $("<ul>", {class: "checkbox-group cnick-checkbox-group"});

        for (const setting in this.settings.direct) {
            console
                .log(setting);
        }

        content.settings.direct = $("<div>", {class: "control-groups"}).append($("<div>", {class: "control-group"})
            .append($("<label>", {
                style: "margin-bottom: 12px",
                text: "Direct Messages"
            })).append(list));

        list = $("<ul>", {class: "checkbox-group cnick-checkbox-group"});

        for (const setting in this.settings.other) {
            console
                .log(setting);
        }

        content.settings.other = $("<div>", {class: "control-groups"}).append($("<div>", {class: "control-group"})
            .append($("<label>", {
                style: "margin-bottom: 12px",
                text: "Other"
            })).append(list));

        panes.append($("<div>", {
            class: "cnick-pane",
            id: "cnick-settings-pane",
            style: "display: none"
        }).append(content.settings.server)
            .append(content.settings.group)
            .append(content.settings.direct)
            .append(content.settings.other));

        // Nicknames //
        tabs.append($("<div>", {
            class: "tab-bar-item cnick-tab",
            id: "cnick-nicknames-tab",
            text: "Nicknames",
            click: ev => {
                ev.stopImmediatePropagation();
                this.changeTab("cnick-nicknames");
            }
        }));

        // Labels: Global (Insert/Reset Global Nicknames), Buttons (Reset Global/All Nicknames)
        content.nicknames = {};
        content.nicknames.menu = $("<div>", {class: "control-groups"}).append(`Full Nickname Menu to come in future update.`);
        content.nicknames.break = $("<div>").append(`<hr>`);
        content.nicknames.buttons = $("<div>", {
            class: "control-groups",
            style: "text-align: center; display: block;"
        }).append($("<button>", {
            class: "btn btn-primary",
            text: "Reset Global",
            click: ev => {
                ev.stopImmediatePropagation();
                this.manageNicknames("resetglobal");
            }
        })).append($("<button>", {
            class: "btn btn-primary",
            text: "Reset All",
            click: ev => {
                ev.stopImmediatePropagation();
                this.manageNicknames("resetall");
            }
        }));

        panes.append($("<div>", {
            class: "cnick-pane",
            id: "cnick-nicknames-pane",
            style: "display: none"
        }).append(content.nicknames.menu)
            .append(content.nicknames.break)
            .append(content.nicknames.buttons));

        // Updates //
        tabs.append($("<div>", {
            class: "tab-bar-item cnick-tab",
            id: "cnick-updates-tab",
            text: "Updates",
            click: ev => {
                ev.stopImmediatePropagation();
                this.changeTab("cnick-updates");
            }
        }));

        // Labels: Version (Display Current Version and New Version Notice), Update Log (Display Update Log)
        // Refer to Custom Emotes on how to do this
        content.updates = $("<div>", {class: "control-groups"}).append(`Updates Page to come on release`);

        panes.append($("<div>", {
            class: "cnick-pane",
            id: "cnick-updates-pane",
            style: "display: none"
        }).append(content.updates));

        // Construct Panel
        settings.append(tabs);
        settings.append(panes);
        scroller.append(settings);
        this.settingsPanel.append(scroller);

        // Create Tab Bar Button Action
        const showSettings = () => {
            $(".tab-bar-item").removeClass("selected");
            this.settingsButton.addClass("selected");
            $(".form .settings-right .settings-inner").hide();

            this.settingsPanel.show();

            if (typeof this.settingsLastTab === "undefined") this.changeTab("cnick-settings");
            else this.changeTab(this.settingsLastTab);
        };

        // Create Tab Bar Button
        this.settingsButton = $("<div>", {
            class: "tab-bar-item cnick-tab-bar-item",
            text: "Client Nicknames",
            id: "cnick-settings-new",
            click(ev) {
                ev.stopImmediatePropagation();
                showSettings();
            }
        });
    };

    this.changeTab = tab => {
        this.settingsLastTab = tab;

        $(".cnick-tab").removeClass("selected");
        $(".cnick-pane").hide();
        $(`#${tab}-tab`).addClass("selected");
        $(`#${tab}-pane`).show();

        // Unique Tab Change Actions
        switch (tab) {
            case "cnick-nicknames": {
                break;
            }
            case "cnick-settings": {
                break;
            }
            case "cnick-updates": {
                // check for updates
                break;
            }
        }
    };

    this.manageNicknames = (action, data) => {
        switch (action) {
            case "save": {
                localStorage.setItem("CN Nicknames", JSON.stringify(data));
                break;
            }
            case "load": {
                return localStorage.getItem("CN Nicknames") ? JSON.parse(localStorage.getItem("CN Nicknames")) : {global: {}};
            }
            case "resetglobal": {
                const nicks = this.manageNicknames("load");

                nicks.global = {};
                localStorage.setItem("CN Nicknames", JSON.stringify(nicks));
                break;
            }
            case "resetall": {
                localStorage.setItem("CN Nicknames", JSON.stringify({global: {}}));
                break;
            }
        }
    };

    this.manageSettings = (action, data) => {
        switch (action) {
            case "save": {
                localStorage.setItem("CN Settings", JSON.stringify(data));
                break;
            }
            case "load": {
                return localStorage.getItem("CN Settings") ? JSON.parse(localStorage.getItem("CN Settings")) : this.defaultSettings;
            }
            case "reset": {
                break;
            }
        }
    };

    this.defaultSettings = {
        server: {
            list: {
                id: "cnick-settings-server-list",
                name: "Server Member List",
                description: "Enable Client Nicknames for the Server Member List.",
                default: true,
                implemented: true
            },
            text: {
                id: "cnick-settings-server-text",
                name: "Text Channel",
                description: "Enable Client Nicknames for Text Channels.",
                default: true,
                implemented: true
            },
            voice: {
                id: "cnick-settings-server-voice",
                name: "Voice Channel",
                description: "Enable Client Nicknames for Voice Channels.",
                default: true,
                implemented: false
            }
        },
        group: {
            list: {
                id: "cnick-settings-group-list",
                name: "Group Member List",
                description: "Enable Client Nicknames for the Group Member List.",
                default: true,
                implemented: true
            },
            messages: {
                id: "cnick-settings-group-messages",
                name: "Text Channel",
                description: "Enable Client Nicknames for Group Messages",
                default: true,
                implemented: true
            },
            call: {
                id: "cnick-settings-group-call",
                name: "Voice Channel",
                description: "Enable Client Nicknames for Group Calls.",
                default: true,
                implemented: false
            }
        },
        direct: {
            list: {
                id: "cnick-settings-direct-list",
                name: "Direct Messages List",
                description: "Enable Client Nicknames for the Direct Messages List.",
                default: true,
                implemented: true
            },
            messages: {
                id: "cnick-settings-direct-messages",
                name: "Direct Messages Messages",
                description: "Enable Client Nicknames for Messages of Direct Messages",
                default: true,
                implemented: true
            },
            title: {
                id: "cnick-settings-direct-title",
                name: "Direct Messages Title",
                description: "Enable Client Nicknames for the Title of Direct Messages",
                default: true,
                implemented: false
            }
        },
        other: {
            friendslist: {
                id: "cnick-settings-other-friendslist",
                name: "Direct Messages List",
                description: "Enable Client Nicknames for the Direct Messages List.",
                default: true,
                implemented: true
            },
            self: {
                id: "cnick-settings-other-self",
                name: "Self",
                description: "Enable Client Nicknames for yourself.",
                default: false,
                implemented: false
            },
            notifications: {
                id: "cnick-settings-other-notifications",
                name: "Desktop Notifications",
                description: "A mere possibility, that is hopefully possible.",
                default: true,
                implemented: false
            }
        }
    };

    this.updateSettings = checkbox => {
        console.log(checkbox);
    };

    this.loadScript = (url, item) => {
        const script = $("<script>", {
            type: "text/javascript",
            src: url,
            id: item
        });

        $("head").append(script);
        console.info(`[Client Nicknames] Loaded: ${item}`);
    };

    this.attachContextButton = () => {
        return $("<div>", {
            class: "item cnick-change-button",
            click: action => {
                action.stopImmediatePropagation();
                // Close the Menu
                $(".context-menu").empty();

                // Get THE span
                const span = $($("span.incoming-calls").siblings()[5]);

                // Create Backdrop
                const backdrop = $("<div>", {
                    class: "callout-backdrop",
                    style: "opacity: 0; transform: translateZ(0px); background-color: rgb(0, 0, 0);",
                    click(ev) {
                        ev.stopImmediatePropagation();

                        span.children(".callout-backdrop").animate({opacity: 0}, 100, "linear");
                        span.children(".modal").animate({opacity: 0}, {
                            duration: 100,
                            easing: "linear",
                            progress: (anim, prog) => {
                                $(anim.elem).css("transform", `scale(${1 - 0.35 * prog})`);
                            },
                            complete() {
                                span.empty();
                            }
                        });
                    }
                });

                backdrop.animate({opacity: 0.85}, 100, "linear");

                span.append(backdrop);
                span.append(this.createNicknameModal());
            }
        }).append('<span>Change Client Nickname</span><div class="hint"></div>');
    };

    this.createNicknameModal = () => {
        const header = $("<div>", {class: "form-header"}).append("<header>Change Client Nickname</header>");

        const inner = $("<div>", {class: "form-inner"}).append($("<div>", {class: "control-group"})
            .append('<label for="nickname">Client Nickname</label><input type="text" id="client-nickname" placeholder="Natsulus">'))
            .append($("<div>", {class: "control-group"}).append("<label><a>Reset Client Nickname</a></label>"));

        const buttons = $("<div>", {class: "form-actions"})
            .append('<button type="button" class="btn btn-default">Cancel</button><button type="submit" class="btn btn-primary">Save</button>');

        const modal = $("<div>", {
            class: "modal",
            style: "opacity: 0; transform: scale(0.65) translateZ(0px);"
        }).append($("<div>", {class: "modal-inner"})
            .append($("<form>", {class: "form"})
                .append(header)
                .append(inner)
                .append(buttons)));

        modal.animate({opacity: 1}, {
            duration: 100,
            easing: "linear",
            progress: (anim, prog) => {
                $(anim.elem).css("transform", `scale(${0.35 * prog + 0.65})`);
            }
        });

        return modal;
    };

    this.detectRightClick = on => {
        if (on) {
            $(document).on("contextmenu", ".user-name, .channel-name.channel-private, .friends-row, .channel-members .member, .channel.private", ev => {
                ev.preventDefault();
                console.log($(ev.target));
            });
        } else {
            $(document).off("contextmenu", ".user-name, .channel-name.channel-private, .friends-row, .channel-members .member, .channel.private");
        }
    };

    ////////////
    // Unused //
    ////////////

    this.onMessage = () => {
        // Not available till v2, may use depending on how it works
    };

    this.onSwitch = () => {
        // Better to use mutations
    };

    this.getSettingsPanel = () => {
        // Using Custom Settings Panel
    };

    this.load = () => {
        // Deprecated in v2, just use start
    };

    this.unload = () => {
        // When does this even occur? lmao
    };
}

/////////////
//  Notes  //
/////////////

/*
{
    "global": {
        "user-id": "nickname"
    },
    "server-id": {
        "user-id": "nickname",
        "user-id": "nickname"
    },
    "server-id": {
        "user-id": "nickname",
        "user-id": "nickname"
    }
}
*/

/*
<li>
    <div class="checkbox" onclick=>
        <div class="checkbox-inner">
            <input type="checkbox">
            <span></span>
        </div>
        <span>
            Message
            <button type="button" class="preview-sound"></button>
        </span>
    </div>
</li>

 <li>
    <div class="checkbox" onclick="settingsPanel.updateSetting(this);">
        <div class="checkbox-inner">
            <input type="checkbox" id="bda-gs-1">
            <span></span>
        </div>
        <span>
            Public Servers - Display public servers button
        </span>
    </div>
</li>
*/

/*
 .user-name (messages)
 .channel-members .member (channel list)
 .channel.private (direct messages)
 .channel-name .channel-private (direct message title)
 .friends-row (friends list)

 onStart
 onSwitch
 onMessageLoad
 onMemberLoad (List)
*/

// Timers are throttled by at least 1000ms when minimised

/*
When user turns plugin off or removes a nickname, user must refresh page either by reloading or switching channels/server for the nicknames disabled to see
their actual name if it was loaded on the page before nickname was disabled. There is a solution to this which is to store the original name, however that
creates too much overhead so I decided against using this solution. If you have a solution to this without too much overhead, please contact me.
*/

// https://natsulus.github.io/Client-Nicknames/plugin/       (updates.json/bg-panel.png/ClientNicknames.plugin.js)