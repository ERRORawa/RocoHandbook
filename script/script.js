var nowVer = 1787172761813;
var dataJSON = [["图鉴", "地区", "果实", "形态", "别称"], ["json", "book", "fruit", "diff", "nick"]];

function clearCache() {
    const urls = [
        "/",
        `script/script.js`,
        `style.css`
    ];
    dataJSON[0].forEach(data => {
        urls.push(`data/${data}.js`);
    });
    caches.open("cache").then(async cache => {
        const cached = await cache.keys();
        cached.forEach(request => {
            urls.forEach(url => {
                if (url == "/") {
                    if (request.url == new URL(location).href) {
                        cache.delete(request);
                    }
                } else if (request.url.includes(new URL(location + url).href)) {
                    cache.delete(request);
                }
            });
        });
    });
    location.reload();
}

try {
    const app = document.querySelector("app");
    const loading = document.getElementById("loading");
    const petList = document.querySelector(".petList");
    const petClass = document.querySelector(".petClass");
    const checkAll = document.querySelector(".checkAll");
    const typeFirst = petClass.querySelector(".typeFirst");
    const typeFirstImg = typeFirst.querySelector(".typeFirst img");
    const typeFirstText = typeFirst.querySelector(".typeFirst span");
    const typeSecond = petClass.querySelector(".typeSecond");
    const typeSecondImg = typeSecond.querySelector(".typeSecond img");
    const typeSecondText = typeSecond.querySelector(".typeSecond span");
    const classBox = petClass.querySelector(".classBox");
    const backBG = classBox.querySelector(".backBG");
    const backImg = classBox.querySelector(".backImg");
    const classContent = classBox.querySelector(".classContent");
    const className = petClass.querySelector(".className span");
    const search = document.querySelector(".search");
    const loadFile = document.querySelector(".loadFile");
    const filterBtn = document.querySelector(".filterBtn");
    const filterPetsCount = document.querySelector(".filterPetsCount span");
    const filterBox = document.querySelector("#filterPanel .box");
    const incomplete = filterBox.querySelector(".onlyIncomplete");
    const filterBooks = filterBox.querySelector(".selectBook");
    var nowBook = filterBox.querySelector(".nowBook");
    const nowBookName = filterBox.querySelector(".bookName");
    const books = filterBooks.querySelectorAll(".book");
    const dataBtn = document.querySelector(".dataManager");
    const dataBox = document.querySelector("#dataPanel .box");
    const userNameText = dataBox.querySelector(".userName .name");
    var userName = "";
    const syncText = dataBox.querySelector(".syncLabel .sync");
    var accessToken = localStorage.getItem("cloudSaveToken") || "";
    var uploadTimer = null;
    const version = [4, 7, 2, 1];  //头像、立绘、果实、背景
    const filterContent = {
        "class": [],
        "types": [],
        "incomplete": false,
        "book": "0"
    }
    const classProgressEle = document.querySelector(".classProgress span");
    var classProgress = [0, 0];
    var pointProgressEle = document.querySelector(".pointProgress span");
    var pointProgress = [0, 0];
    var collectProgress = {
        "exp": [0, 0],
        "crystal": [0, 0],
        "star": [0, 0],
        "soul": [0, 0],
        "fruit": [0, 0],
        "skill": [0, 0]
    }
    const moreInfoBtn = petClass.querySelector(".className .moreInfo");
    const infoPanel = petClass.querySelector(".className .infoPanel");
    const alertPanel = document.querySelector("#alertPanel");
    const noNetworkText = document.querySelector(".noNetwork");
    const fcBtn = document.querySelector(".fullscreen");
    var swVer = 1782053515028;
    var noticeVer = 5;
    var noticeContent = { title: "更新公告", text: "增加课题研究点数统计\n\n增加课题奖励收集统计（点击课题研究点显示）\n\n每个课题都增加“完成该课题能够获取到的奖励”显示\n\n云存档支持长期在线", showBtn: true };

    async function checkUpdate() {
        try {
            if (window.location.host != "127.0.0.1:3000") {
                let updateSW = await fetch(`updateSW.txt?${new Date().getTime()}`);
                let checkSW = await updateSW.text();
                const regs = await navigator.serviceWorker.getRegistrations();
                if (regs.length != 0) {
                    if (regs[0].active.scriptURL.split("?")[1] != checkSW) {
                        regs.forEach(async reg => await reg.unregister());
                        await navigator.serviceWorker.register(`sw.js?${checkSW}`);
                    }
                } else {
                    await navigator.serviceWorker.register(`sw.js?${checkSW}`);
                }
            }
            let updateTime = await fetch(`updateTime.txt?${new Date().getTime()}`);
            let checkTime = await updateTime.text();
            if (nowVer != parseInt(checkTime)) {
                const regs = await navigator.serviceWorker.getRegistrations();
                let reg = regs[0];
                const sw = reg.installing || reg.waiting || reg.active;
                navigator.serviceWorker.addEventListener("message", (event) => {
                    if (event.data.type == "reload") {
                        location.reload();
                    }
                })
                sw.postMessage({
                    type: "reload"
                });
            }
        } catch {
            accessToken = "";
            noNetworkText.style.display = "";
        }
        return;
    }

    function checkRotate(isLoaded = false) {
        if (!loading.classList.contains("hide") && !isLoaded) {
            return;
        }
        let time = 0;
        if (isLoaded) {
            time = 500;
        }
        let height = window.innerHeight;
        let width = window.innerWidth;
        if (isLoaded) {
            if ("ontouchstart" in window) {
                fcBtn.style.display = "block";
                document.addEventListener("fullscreenchange", () => {
                    if (document.fullscreenElement) {
                        fcBtn.innerText = "退出全屏";
                    } else {
                        fcBtn.innerText = "翻转横屏";
                    }
                });
            } else {
                fcBtn.style.display = "none";
                document.body.style.minWidth = "845px";
            }
        }
        if (height > width + (width / 10) && "ontouchstart" in window) {
            setTimeout(() => {
                let minHeight = 550;
                document.body.classList.add("rotate");
                height = window.innerHeight;
                width = window.innerWidth;
                let zoom = 1;
                if (width < minHeight) {
                    let newHeight = (height / width) * minHeight;
                    zoom = height / newHeight;
                }
                app.style.zoom = zoom;
                document.body.style.left = `${width}px`;
                document.body.style.height = `${width}px`;
                document.body.style.width = `${height}px`;
                loading.classList.remove("willRotate");
            }, time);
        } else {
            let minHeight = 550;
            let zoom = 1;
            document.body.classList.remove("rotate");
            if (height < minHeight && "ontouchstart" in window) {
                let newWidth = (width / height) * minHeight;
                zoom = width / newWidth;
            }
            document.body.style.left = "";
            app.style.zoom = zoom;
            document.body.style.width = `${width}px`;
            document.body.style.height = `${height}px`;
        }
    }

    async function preload(preUrls) {
        let urls = preUrls;
        dataJSON[0].forEach(data => {
            urls.push(`/data/${data}.js?${nowVer}`);
        });
        urls.push(
            "/",
            "/favicon.ico",
            "/font-awesome-4/css/font-awesome.min.css",
            "/font-awesome-4/fonts/fontawesome-webfont.woff2?v=4.7.0",
            `/script/script.js?${nowVer}`,
            `/style.css?${nowVer}`,
            "/typeIcon/冰.png",
            "/typeIcon/草.png",
            "/typeIcon/虫.png",
            "/typeIcon/地.png",
            "/typeIcon/电.png",
            "/typeIcon/毒.png",
            "/typeIcon/恶.png",
            "/typeIcon/光.png",
            "/typeIcon/幻.png",
            "/typeIcon/火.png",
            "/typeIcon/机械.png",
            "/typeIcon/龙.png",
            "/typeIcon/萌.png",
            "/typeIcon/普通.png",
            "/typeIcon/水.png",
            "/typeIcon/武.png",
            "/typeIcon/翼.png",
            "/typeIcon/幽.png",
            "/handbook/texture/finish.png",
            "/handbook/texture/select.png",
            "/handbook/texture/SideBar.png",
            "/handbook/texture/diffOff.png",
            "/handbook/texture/diffOn.png",
            "/handbook/texture/yiseOff.png",
            "/handbook/texture/yiseOn.png",
            "/handbook/texture/item/crystal.png",
            "/handbook/texture/item/exp.png",
            "/handbook/texture/item/point.png",
            "/handbook/texture/item/recipe.png",
            "/handbook/texture/item/soul.png",
            "/handbook/texture/item/star.png",
        );
        for (let i = 1; i <= 19; i++) {
            urls.push(`/handbook/BG/${i}.png?${version[3]}`);
        }
        for (let i = 0; i <= 3; i++) {
            urls.push(`/handbook/book/${i}.png`);
        }
        document.querySelectorAll(".filterTypes .content span").forEach(type => {
            urls.push(`/handbook/texture/item/stone/${type.innerText}.png`);
            urls.push(`/handbook/texture/item/recipe/${type.innerText}.png`);
        });
        const regs = await navigator.serviceWorker.getRegistrations();
        let reg = null;
        if (regs.length == 0) {
            reg = await navigator.serviceWorker.register(`sw.js?${swVer}`);
        } else {
            reg = regs[0];
        }
        const sw = reg.installing || reg.waiting || reg.active;
        console.log(urls);
        sw.postMessage({
            type: "preload",
            urls: urls,
            location: window.location.origin
        });
    }

    async function deleteCookie() {
        let response = await fetch("https://api.errorawa.dpdns.org/roco", {
            method: "DELETE",
            credentials: "include"
        });
        return "";
    }

    async function getUserName() {
        let response = await fetch("https://gitee.com/api/v5/user", {
            headers: {
                "Authorization": `token ${accessToken}`
            }
        });
        if (response.ok) {
            let userInfo = await response.json();
            return userInfo.name;
        } else {
            accessToken = "";
            return "";
        }
    }

    async function createCloudSave() {
        let response = await fetch("https://gitee.com/api/v5/user/repos", {
            method: "POST",
            headers: {
                "Authorization": `token ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": "rocoSave",
                "description": "洛克图鉴云存档",
                "private": true
            })
        });
        return "";
    }

    async function getDataFile() {
        let response = await fetch(`https://gitee.com/api/v5/repos/${userName}/rocoSave/raw/save.json`, {
            headers: {
                "Authorization": `token ${accessToken}`
            }
        });
        if (response.status == 404) {
            return await createDataFile();
        } else {
            return await response.text();
        }
    }

    async function createDataFile() {
        let data = getLocalSaveBinary();
        let response = await fetch(`https://gitee.com/api/v5/repos/${userName}/rocoSave/contents/save.json`, {
            method: "POST",
            headers: {
                "Authorization": `token ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "content": btoa(data),
                "message": "create_file"
            })
        });
        return "";
    }

    async function uploadDataFile() {
        syncText.innerText = "同步中";
        syncText.style.color = "#105286";
        let data = getLocalSaveBinary();
        let shaRes = await fetch(`https://gitee.com/api/v5/repos/${userName}/rocoSave/contents/save.json`, {
            headers: {
                "Authorization": `token ${accessToken}`
            }
        });
        let resData = await shaRes.json();
        let sha = resData.sha;
        let response = await fetch(`https://gitee.com/api/v5/repos/${userName}/rocoSave/contents/save.json`, {
            "method": "PUT",
            headers: {
                "Authorization": `token ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "content": btoa(data),
                "sha": sha,
                "message": "upload_file"
            })
        });
        syncText.innerText = "已同步";
        syncText.style.color = "#17ac0b";
        return "";
    }

    function downloadDataFile(cloudSave) {
        const notice = localStorage.getItem("notice");
        localStorage.clear();
        localStorage.setItem("cloudSaveToken", accessToken);
        localStorage.setItem("notice", notice);
        Object.keys(cloudSave).forEach(key => {
            localStorage[key] = cloudSave[key];
        });
        syncText.innerText = "已同步";
        syncText.style.color = "#17ac0b";
    }

    function getLocalSaveBinary() {
        const encoder = new TextEncoder();
        let localData = JSON.parse(JSON.stringify(localStorage));
        delete(localData["cloudSaveToken"]);
        delete(localData["notice"]);
        let bytes = encoder.encode(JSON.stringify(localData));
        let binary = '';
        bytes.forEach(byte => binary += String.fromCharCode(byte));
        return binary;
    }

    function compSaveData(cloudData) {
        let local = false;
        let cloud = false;
        Object.keys(cloudData).forEach(key => {
            if (["notice", "cloudSaveToken"].includes(key)) {
                return;
            }
            let localItems = [];
            let cloudItems = [];
            try {
                localItems = JSON.parse(localStorage.getItem(key));
            } catch {
                localItems = [];
            }
            try {
                cloudItems = JSON.parse(cloudData[key]);
            } catch {
                cloudItems = [];
            }
            if (!localItems && !cloudItems) {
            } else if (!localItems) {
                cloud = true;
            } else if (!cloudItems) {
                local = true;
            } else {
                let localID = [];
                let cloudID = [];
                let localSkill = [];
                let cloudSkill = [];
                localItems.forEach(item => {
                    localID.push(item[0]);
                    if (item[0] == 11) {
                        localSkill = item[1];
                    }
                });
                cloudItems.forEach(item => {
                    cloudID.push(item[0]);
                    if (item[0] == 11) {
                        cloudSkill = item[1];
                    }
                });
                cloudID.forEach(id => {
                    if (!localID.includes(id)) {
                        cloud = true;
                    } else if (id == 11) {
                        cloudSkill.forEach(skill => {
                            if (!localSkill.includes(skill)) {
                                cloud = true;
                            }
                        })
                    }
                });
                localID.forEach(id => {
                    if (!cloudID.includes(id)) {
                        local = true;
                    } else if (id == 11) {
                        localSkill.forEach(skill => {
                            if (!cloudSkill.includes(skill)) {
                                local = true;
                            }
                        })
                    }
                });
            }
        });
        if (local && cloud) {
            console.log("存档冲突");
            return 3;
        } else if (local) {
            console.log("需要上传");
            return 2;
        } else if (cloud) {
            console.log("需要下载");
            return 1;
        } else {
            syncText.innerText = "已同步";
            syncText.style.color = "#17ac0b";
            return 0;
        }
    }

    async function checkData(firstLoad = true) {
        userName = await getUserName();
        if (userName) {
            userNameText.innerText = userName;
            dataBox.classList = "box logged";
            await createCloudSave();
            let cloudSave = await getDataFile();
            if (!cloudSave) {
                syncText.innerText = "已同步";
                syncText.style.color = "#17ac0b";
            } else {
                cloudSave = JSON.parse(cloudSave);
                let type = compSaveData(cloudSave);
                switch(type) {
                    case 1:
                        if (firstLoad) {
                            downloadDataFile(cloudSave);
                            break;
                        }
                    case 3:
                        const btns = alertPanel.querySelector(".alertBtns");
                        const html = btns.innerHTML;
                        btns.innerHTML = html;
                        const localBtn = btns.querySelector(".local");
                        localBtn.innerText = "本地";
                        localBtn.addEventListener("click", () => {
                            closePanel("alertPanel");
                            uploadDataFile();
                        });
                        const cloudBtn = btns.querySelector(".cloud");
                        cloudBtn.innerText = "云端";
                        cloudBtn.addEventListener("click", () => {
                            closePanel("alertPanel");
                            downloadDataFile(cloudSave);
                            location.reload();
                        });
                        showAlertBox("cloudSave", { title: "存档冲突", text: "云端存档与本地存档内容均不一致\n请选择要保存的存档", tip: "若选择关闭该窗口，将不执行任何操作\n但在你更改课题内容后将会默认执行上传存档", showBtn: true });
                        break;
                    case 2:
                        uploadDataFile();
                        break;
                }
            }
        } else {
            userNameText.innerText = "未登录";
            dataBox.classList.remove("logged");
        }
        return "";
    }

    function setType(first, second) {
            typeFirstImg.src = `typeIcon/${first}.png`;
            typeFirstText.innerText = first;
            if (second != undefined) {
                typeSecond.style.opacity = "";
                typeSecondImg.src = `typeIcon/${second}.png`;
                typeSecondText.innerText = second;
            } else {
                typeSecond.style.opacity = "0";
            }
    }

    function setClass(petBox, id) {
        let nowClassFinish = 0;
        scrollPetList(petBox);
        if (petBox.classList.contains("select")) {
            return;
        }
        const last = petList.querySelector(".select");
        if (last != undefined) {
            const lastID = last.querySelector(".id").getAttribute("key");
            last.querySelector(".name").innerText = json[lastID].name;
            last.querySelector(".avatar").src = `avatar/${lastID}.png?${version[0]}`
            last.classList.remove("select");
        }
        petBox.classList.add("select");
        petClass.classList.add("switch"); 
        infoPanel.classList.remove("show");
        moreInfoBtn.innerHTML = "&#xf129";
        classBox.classList.remove("preview");
        setTimeout(() => {
            if (json[id].class.length == 0) {
                infoPanel.classList.add("show");
                moreInfoBtn.innerHTML = "&#xf00d";
                classBox.classList.add("preview");
            }
            const avatar = petBox.querySelector(".avatar");
            avatar.onerror = null;
            backImg.onerror = null;
            classContent.innerHTML = "";
            let finish = JSON.parse(localStorage.getItem(id));
            if (finish == null) {
                finish = [];
            }
            const pet = json[id];
            setType(pet.type[0], pet.type[1]);
            backBG.style.backgroundImage = `url(handbook/BG/${pet.bg}.png?${version[3]}`;
            backImg.style.backgroundImage = `url(illustration/${id}.png?${version[1]})`;
            if (pet.reverse) {
                backImg.classList.add("reverse");
            } else {
                backImg.classList.remove("reverse");
            }
            className.innerText = pet.name;
            let k = 0;
            for (let i = 0; i < pet.class.length; i++) {
                const Class = document.createElement("div");
                Class.classList.add("class");
                const content = document.createElement("div");
                content.classList.add("content");
                const text = document.createElement("p");
                const items = document.createElement("div");
                items.classList.add("items");
                const checkbox = document.createElement("input");
                let item = [];
                checkbox.type = "checkbox";
                Class.appendChild(content);
                content.appendChild(text);
                content.appendChild(items);
                Class.appendChild(checkbox);
                switch (pet.class[i][0]) {
                    case "1":
                        text.innerText = "捕捉1只精灵";
                        item = [
                            ["exp", 150],
                            ["point", 5]
                        ];
                        break;
                    case "2":
                        text.innerText = "捕捉1只了不起天分的精灵";
                        item = [
                            ["exp", 150],
                            ["point", 10]
                        ]
                        break;
                    case "3":
                        text.innerText = "使精灵成功进化1次";
                        item = [
                            ["crystal", 50],
                            ["point", 10]
                        ]
                        break;
                    case "4":
                        text.innerText = `使${pet.name}的亲密度等级达到5级`;
                        item = [
                            ["recipe", 1],
                            ["point", 50]
                        ]
                        break;
                    case "5":
                        text.innerText = "捕捉20只精灵";
                        item = [
                            ["fruit", 1],
                            ["point", 20]
                        ]
                        break;
                    case "6":
                        text.innerText = "捕捉1只炫彩突变的精灵";
                        item = [
                            ["soul", 1],
                            ["point", 30]
                        ]
                        break;
                    case "7":
                        text.innerText = "捕捉1只异色突变的精灵";
                        item = [
                            ["soul", 1],
                            ["point", 50]
                        ]
                        break;
                    case "8":
                        text.innerText = `确认${pet.class[i][1]}种不同样子的${pet.name}`;
                        item = [
                            ["star", 1],
                            ["point", 20]
                        ]
                        break;
                    case "9":
                        text.innerText = "使用进化之力，将精灵进化为首领";
                        item = [
                            ["star", 1],
                            ["point", 30]
                        ]
                        break;
                    case "10":
                        text.innerText = "获得「命定勇者」奖牌";
                        item = [
                            ["crystal", 300],
                            ["point", 50]
                        ]
                        break;
                    case "11":
                        text.innerText = `使用${pet.class[i][1][k][0]}次${pet.class[i][1][k][1]}`;
                        item = [
                            ["skillStone", pet.type[0]],
                            ["skillRecipe", pet.type[0]],
                            ["point", 10]
                        ]
                        if (pet.class[i][1][k][2]) {
                            item[0][1] = pet.class[i][1][k][2];
                            item[1][1] = pet.class[i][1][k][2];
                        }
                        break;
                }
                item.forEach(_item => {
                    const itemEle = document.createElement("div");
                    itemEle.classList.add("item");
                    const count = document.createElement("div");
                    count.classList.add("count");
                    const countText = document.createElement("span");
                    const image = document.createElement("img");
                    countText.innerText = `×1`;
                    if (_item[0] == "fruit") {
                        image.src = `fruits/${pet.fruit[0]}.png?${version[2]}`;
                    } else if (_item[0] == "skillStone") {
                        image.src = `handbook/texture/item/stone/${_item[1]}.png`;
                    } else if (_item[0] == "skillRecipe") {
                        image.src = `handbook/texture/item/recipe/${_item[1]}.png`;
                    } else {
                        image.src = `handbook/texture/item/${_item[0]}.png`;
                        countText.innerText = `×${_item[1]}`;
                    }
                    items.appendChild(itemEle);
                    itemEle.appendChild(image);
                    itemEle.appendChild(count);
                    count.appendChild(countText);
                });
                if (finish.some(item => item[0] === pet.class[i][0])) {
                    if (pet.class[i][0] == "11") {
                        if (finish[finish.length - 1][1].some(item => item === pet.class[i][1][k][1])) {
                            checkbox.checked = true;
                            nowClassFinish++;
                        }
                    } else {
                        checkbox.checked = true;
                        nowClassFinish++;
                    }
                }
                if (pet.class[i][0] == "11") {
                    checkbox.setAttribute("data", JSON.stringify([pet.class[i][0], pet.class[i][1][k][1]]));
                    k++;
                    if (k != pet.class[i][1].length) {
                        i--;
                    } else {
                        i++;
                    }
                } else {
                    checkbox.setAttribute("data", JSON.stringify([pet.class[i]]));
                }
                classContent.appendChild(Class);
                let all = pet.class.length;
                if (pet.class[pet.class.length - 1][0] == "11") {
                    all += pet.class[pet.class.length - 1][1].length - 1;
                }
                const finishClass = petClass.querySelectorAll(".classContent input[type=checkbox]:checked");
                if (finishClass.length == all) {
                    checkAll.innerText = "全部取消";
                } else {
                    checkAll.innerText = "全部完成";
                }
                checkbox.parentElement.addEventListener("click", () => {
                    clearTimeout(uploadTimer);
                    syncText.innerText = "等待同步";
                    syncText.style.color = "#867010";
                    checkbox.checked = !checkbox.checked;
                    if (checkbox.checked) {
                        checkbox.classList.add("check");
                        item.forEach(_item => {
                            if (_item[0] != "recipe") {
                                if (_item[0] != "point") {
                                    if (_item[0].includes("skill")) {
                                        if (_item[0] != "skillStone")
                                        {
                                            collectProgress["skill"][0] += 1;
                                        }
                                    } else {
                                        collectProgress[_item[0]][0] += _item[1];
                                    }
                                } else {
                                    pointProgress[0] += _item[1];
                                }
                            }
                        });
                        checkbox.classList.remove("unCheck");
                    } else {
                        checkbox.classList.add("unCheck");
                        checkbox.classList.remove("check");
                        item.forEach(_item => {
                            if (_item[0] != "recipe") {
                                if (_item[0] != "point") {
                                    if (_item[0].includes("skill")) {
                                        if (_item[0] != "skillStone")
                                        {
                                            collectProgress["skill"][0] -= 1;
                                        }
                                    } else {
                                        collectProgress[_item[0]][0] -= _item[1];
                                    }
                                } else {
                                    pointProgress[0] -= _item[1];
                                }
                            }
                        });
                    }
                    const finishClass = petClass.querySelectorAll(".classContent input[type=checkbox]:checked");
                    const update = [];
                    finishClass.forEach(check => {
                        let content = JSON.parse(check.getAttribute("data"));
                        if (content[0] != "11") {
                            update.push(content[0]);
                        } else {
                            if (update.length == 0) {
                                update.push([content[0], [content[1]]]);
                            } else if (update[update.length - 1][0] == "8" || update[update.length - 1].length != 2) {
                                update.push([content[0], [content[1]]]);
                            } else {
                                update[update.length - 1][1].push(content[1]);
                            }
                        }
                    });
                    localStorage.setItem(id, JSON.stringify(update));
                    checkAll.innerText = "全部完成";
                    const progress = petBox.querySelector(".progress");
                    progress.classList.remove("finish");
                    progress.innerText = `${finishClass.length}/${all}`;
                    classProgress[0] += finishClass.length - nowClassFinish;
                    nowClassFinish = finishClass.length;
                    const classPercent = Math.floor(classProgress[0] / classProgress[1] * 10000) / 100;
                    classProgressEle.innerText = `${classProgress[0]}/${classProgress[1]} (${classPercent}%)`;
                    const pointPercent = Math.floor(pointProgress[0] / pointProgress[1] * 10000) / 100;
                    pointProgressEle.innerText = `${pointProgress[0]}/${pointProgress[1]} (${pointPercent}%)`;
                    if (finishClass.length == all) {
                        checkAll.innerText = "全部取消";
                        progress.innerText = "完成";
                        progress.classList.add("finish");
                    }
                    if (userName) {
                        uploadTimer = setTimeout(uploadDataFile, 1000);
                    }
                });
            }
            infoPanel.innerHTML = "<div class='shadow'></div>";
            let infoContent = document.createElement("div");
            let infoPanelHeight = 20;
            let diffName = document.createElement("p");
            diffName.classList.add("diffName");
            let diffT = "";
            let yise = "";
            infoContent.classList.add("infoContent");
            const petName = document.querySelector(".select .name");
            if (diff[id] != undefined || pet.diff || pet.lead || pet.yise || pet.fruit) {
                function setDiff(diffInfo = undefined) {
                    if (diffInfo != undefined) {
                        checkDiff(diffInfo);
                    }
                    const preResName = id + diffT;
                    if (nick[preResName]) {
                        const nickName = nick[preResName];
                        if (typeof nickName == "object") {
                            if (typeof nickName[1] == "object") {
                                setType(nickName[1][0], nickName[1][1]);
                            } else {
                                backBG.style.backgroundImage = `url(handbook/BG/${nickName[1]}.png?${version[3]}`;
                            }
                            if (nickName.length == 3) {
                                backBG.style.backgroundImage = `url(handbook/BG/${nickName[2]}.png?${version[3]}`;
                            }
                            if (diffT.includes("首领")) {
                                className.innerText = nickName[0];
                                petName.innerText = nickName[0];
                                diffName.classList.remove("show");
                            } else {
                                petName.innerText = pet.name;
                                className.innerText = pet.name;
                                diffName.innerText = nickName[0];
                                diffName.classList.add("show");
                            }
                        } else {
                            setType(pet.type[0], pet.type[1]);
                            backBG.style.backgroundImage = `url(handbook/BG/${pet.bg}.png?${version[3]}`;
                            if (diffT.includes("首领")) {
                                petName.innerText = nickName;
                                className.innerText = nickName;
                                diffName.classList.remove("show");
                            } else {
                                petName.innerText = pet.name;
                                className.innerText = pet.name;
                                diffName.innerText = nickName;
                                diffName.classList.add("show");
                            }
                        }
                    } else {
                        setType(pet.type[0], pet.type[1]);
                        backBG.style.backgroundImage = `url(handbook/BG/${pet.bg}.png?${version[3]}`;
                        petName.innerText = pet.name;
                        className.innerText = pet.name;
                        diffName.classList.remove("show");
                    }
                    avatar.onerror = () => {
                        let resName = preResName + ".png";
                        avatar.onerror = function() {
                            avatar.onerror = null;
                            avatar.src = `avatar/${id}.png?${version[0]}`;
                        }
                        avatar.src = `avatar/${resName}?${version[0]}`;
                    };
                    let resName = preResName + yise + ".png";
                    avatar.src = `avatar/${resName}?${version[0]}`;
                    const setImg = new Image();
                    setImg.onload = () => {
                        backImg.style.backgroundImage = `url(illustration/${resName}?${version[1]})`;
                    }
                    setImg.onerror = () => {
                        let resName = preResName + ".png";
                        setImg.onload = () => {
                            backImg.style.backgroundImage = `url(illustration/${resName}?${version[1]})`;
                        }
                        setImg.onerror = () => {
                            backImg.style.backgroundImage = `url(illustration/${id}.png?${version[1]})`;
                        }
                        setImg.src = `illustration/${resName}?${version[1]}`;
                    }
                    setImg.src = `illustration/${resName}?${version[1]}`;
                }
                function checkDiff(diffInfo) {
                    if (diff[id + diffT] != undefined) {
                        diffInfo.classList.add("show");
                    } else {
                        diffInfo.classList.remove("show");
                    }
                }
                moreInfoBtn.classList.remove("noInfo");
                infoPanel.appendChild(infoContent);
                if (diff[id] != undefined || pet.diff || pet.lead) {
                    infoPanelHeight += 160;
                    let title = document.createElement("p");
                    let diffOn = false;
                    let leadOn = false;
                    title.classList.add("diffTitle");
                    title.innerText = "普通形态";
                    infoContent.appendChild(title);
                    diffInfo = document.createElement("button");
                    diffInfo.classList.add("diffInfo");
                    diffInfo.innerText = "获取方式";
                    diffInfo.addEventListener("click", () => {
                        showAlertBox("diff", { id: id + diffT });
                    });
                    let diffEle = document.createElement("div");
                    diffEle.classList.add("diff");
                    if (pet.diff || pet.lead) {
                        diffEle.addEventListener("click", (event) => {
                            if (event.target.nodeName == "SPAN") {
                                return;
                            }
                            if (!diffOn) {
                                if (pet.diff) {
                                    diffT = "-1";
                                    title.innerText = "其它形态";
                                    if (pet.diff > 1) {
                                        diffEle.classList.add("area");
                                    } else {
                                        diffEle.classList.remove("area");
                                    }
                                } else {
                                    if (pet.lead > 1) {
                                        diffT = "-首领1";
                                        diffEle.classList.add("area");
                                    } else {
                                        diffT = "-首领";
                                        diffEle.classList.remove("area");
                                    }
                                    title.innerText = "首领形态";
                                    leadOn = true;
                                }
                                diffEle.classList.add("show");
                            } else {
                                if (pet.lead && !leadOn) {
                                    if (pet.lead > 1) {
                                        diffT = "-首领1";
                                        diffEle.classList.add("area");
                                    } else {
                                        diffT = "-首领";
                                        diffEle.classList.remove("area");
                                    }
                                    title.innerText = "首领形态";
                                    leadOn = true;
                                    setDiff(diffInfo);
                                    return;
                                } else {
                                    diffT = "";
                                    title.innerText = "普通形态";
                                    diffEle.classList.remove("show");
                                    leadOn = false;
                                }
                            }
                            diffOn = !diffOn;
                            setDiff(diffInfo);
                        });
                        setDiff(diffInfo);
                    } else {
                        diffEle.classList.add("show");
                        diffEle.addEventListener("click", () => {
                            showAlertBox("diff", { id: id }); 
                        });
                    }
                    infoContent.appendChild(diffEle);
                    infoContent.appendChild(diffName);
                    if (pet.diff > 1 || pet.lead > 1) {
                        let left = document.createElement("span");
                        left.classList.add("left");
                        left.innerHTML = "&#xf104";
                        left.addEventListener("click", () => {
                            if (!leadOn) {
                                let index = parseInt(diffT.slice(1));
                                if (index == 1) {
                                    index = pet.diff;
                                } else {
                                    index--;
                                }
                                diffT = `-${index}`;
                            } else {
                                let index = parseInt(diffT.slice(3));
                                if (index == 1) {
                                    index = pet.lead;
                                } else {
                                    index--;
                                }
                                diffT = `-首领${index}`;
                            }
                            setDiff(diffInfo);
                        });
                        let right = document.createElement("span");
                        right.classList.add("right");
                        right.innerHTML = "&#xf105";
                        right.addEventListener("click", () => {
                            if (!leadOn){
                                let index = parseInt(diffT.slice(1));
                                if (index == pet.diff) {
                                    index = 1;
                                } else {
                                    index++;
                                }
                                diffT = `-${index}`;
                            } else {
                                let index = parseInt(diffT.slice(3));
                                if (index == pet.lead) {
                                    index = 1;
                                } else {
                                    index++;
                                }
                                diffT = `-首领${index}`;
                            }
                            setDiff(diffInfo);
                        });
                        diffEle.appendChild(left);
                        diffEle.appendChild(right);
                    }
                    infoContent.appendChild(diffInfo);
                }
                if (pet.yise) {
                    infoPanelHeight += 140;
                    let title = document.createElement("p");
                    let yiseOn = false;
                    title.classList.add("yiseTitle");
                    title.innerText = "异色";
                    infoContent.appendChild(title);
                    let yiseEle = document.createElement("div");
                    yiseEle.classList.add("yise");
                    yiseEle.style.backgroundImage = "url(handbook/texture/yiseOff.png)";
                    yiseEle.addEventListener("click", () => {
                        yiseOn = !yiseOn;
                        if (yiseOn) {
                            yise = "-异色";
                            yiseEle.style.backgroundImage = `url(handbook/texture/yiseOn.png)`;
                        } else {
                            yise = "";
                            yiseEle.style.backgroundImage = `url(handbook/texture/yiseOff.png)`;
                        }
                        setDiff();
                    });
                    infoContent.appendChild(yiseEle);
                }
                if (pet.fruit) {
                    infoPanelHeight += 140;
                    let title = document.createElement("p");
                    title.classList.add("fruitTitle");
                    title.innerText = "相关果实";
                    infoContent.appendChild(title);
                    pet.fruit.forEach(item => {
                        let name = "";
                        let num = "";
                        if (typeof item == "object") {
                            num = item[0];
                            name = item[1];
                        } else {
                            num = item;
                            name = json[item].name;
                        }
                        let fruitEle = document.createElement("div");
                        fruitEle.classList.add("fruit");
                        fruitEle.style.backgroundImage = `url(fruits/${num}.png?${version[2]})`;
                        fruitEle.addEventListener("click", () => {
                            showAlertBox("fruit", { id: num, name: name, title: `${name}的果实` });
                        });
                        infoContent.appendChild(fruitEle);
                    });
                }
                infoPanel.style.height = `${infoPanelHeight}px`;
                infoContent.style.height = `${infoPanelHeight - 20}px`;
            } else {
                moreInfoBtn.classList.add("noInfo");
            }
            petClass.classList.remove("switch");
        }, 200);
    }

    function scrollPetList(petBox) {
        const startScrollTop = petList.scrollTop;
        const targetOffsetTop = petBox.offsetTop;
        let targetScrollTop;
        let position = petBox.offsetTop - startScrollTop - petList.offsetHeight;
        if (position > -50) {
            targetScrollTop = petBox.offsetTop - petList.offsetHeight + 50;
        } else if (position < -petList.offsetHeight + 130) {
            targetScrollTop = petBox.offsetTop - 160;
        } else {
            return;
        }
        targetScrollTop = Math.max(0, Math.min(targetScrollTop, petList.scrollHeight - petList.clientHeight));
        const diff = targetScrollTop - startScrollTop;
        const duration = 200;
        let startTime = null;
        function easeInOut(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }
        function step(timestamp) {
            if (startTime === null) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOut(progress);
            petList.scrollTop = startScrollTop + diff * easedProgress;
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }

    function filter() {
        let petNames = petList.querySelectorAll(".petBox .info .name");
        let idNotFound = true;
        let hasFilter = false;
        const searchValue = search.value;
        const showPet = [];
        const hidePet = [];
        petNames.forEach(petName => {
            let isHide = false;
            let petID = petName.parentElement.querySelector(".id").getAttribute("key");
            if (filterContent["book"] != 0 && !isHide) {
                hasFilter = true;
                if (!book[filterContent["book"]]["pets"].includes(parseInt(petID))) {
                    isHide = true;
                }
            }
            if (searchValue != "" && !isHide) {
                if (!isNaN(searchValue)) {
                    if (parseInt(searchValue) == parseInt(petID)) {
                        petName.parentElement.parentElement.click();
                        search.value = "";
                        idNotFound = false;
                    }
                } else if (!petName.textContent.includes(searchValue)) {
                    idNotFound = false;
                    isHide = true;
                }
            } else {
                idNotFound = false;
            }
            if (filterContent["class"].length != 0 && !isHide) {
                hasFilter = true;
                let Class = json[petID].class;
                if (filterContent["incomplete"]) {
                    let finish = JSON.parse(localStorage.getItem(petID));
                    if (finish == null) {
                        finish = [];
                    }
                    let tempClass = [];
                    let finishCount = 0;
                    Class.forEach(item => {
                        if(filterContent["class"].includes(item[0])) {
                            tempClass.push(item[0]);
                            if (item[0] == "11") {
                                tempClass.push(item[1]);
                            }
                        }
                    });
                    finish.forEach(item => {
                        if (tempClass.includes(item[0])) {
                            if (item[0] == "11") {
                                let isFinishSkill = true;
                                tempClass[tempClass.length - 1].forEach(skill => {
                                    if (!item[1].includes(skill[1])) {
                                        isFinishSkill = false;
                                    }
                                });
                                if (isFinishSkill) {
                                    finishCount+=2;
                                }
                            } else {
                                finishCount++;
                            }
                        }
                    });
                    if (finishCount == tempClass.length) {
                        isHide = true;
                    }
                } else {
                    if (!Class.some(item => filterContent["class"].includes(item[0]))) {
                        isHide = true;
                    }
                }
            } else if (filterContent["incomplete"]) {
                hasFilter = true;
                if (petName.parentElement.parentElement.querySelector(".finish") != undefined) {
                    isHide = true;
                }
            }
            if (filterContent["types"].length != 0 && !isHide) {
                hasFilter = true;
                let types = json[petID].type;
                if (!types.some(item => filterContent["types"].includes(item))) {
                    isHide = true;
                }
            }
            if (!isHide) {
                showPet.push(petName.parentElement.parentElement);
            } else {
                hidePet.push(petName.parentElement.parentElement);
            }
        });
        if (idNotFound) {
            alert("未找到对应编号的精灵");
        }
        requestAnimationFrame(() => {
            showPet.forEach(petBox => petBox.classList.remove("hidden"));
            hidePet.forEach(petBox => petBox.classList.add("hidden"));
            const nowSelect = petList.querySelector(".petBox.select");
            if (nowSelect.classList.contains("hidden")) {
                const willSelect = petList.querySelector(".petBox:not(.hidden)");
                if (willSelect != null) {
                    nowSelect.classList.remove("select");
                    willSelect.click();
                }
            }
            if (hasFilter) {
                filterPetsCount.innerText = petList.querySelectorAll(".petBox:not(.hidden)").length;
                filterBtn.classList.add("hasFilter");
            } else {
                filterBtn.classList.remove("hasFilter");
            }
        });
        setTimeout(() => {scrollPetList(petList.querySelector(".select"))}, 400);
    }

    function openFilter() {
        filterBox.parentElement.classList.add("show");
        incomplete.checked = filterContent["incomplete"];
        filterBox.querySelectorAll(".filterClass .content div").forEach(nowClass => {
            if (filterContent["class"].includes(nowClass.getAttribute("data"))) {
                nowClass.classList.add("select");
            } else {
                nowClass.classList.remove("select");
            }
        });
        filterBox.querySelectorAll(".filterTypes .content div").forEach(nowType => {
            if (filterContent["types"].includes(nowType.innerText)) {
                nowType.classList.add("select");
            } else {
                nowType.classList.remove("select");
            }
        });
        nowBookName.innerText = book[filterContent["book"]]["name"];
        nowBook.setAttribute("data", filterContent["book"]);
        nowBook.src = `handbook/book/${filterContent["book"]}.png`;
        books.forEach(book => {
            if (book.getAttribute("data") != filterContent["book"]) {
                book.classList.remove("select");
            } else {
                book.classList.add("select");
            }
        });
    }

    function closePanel(eleClass) {
        let panel = document.getElementById(eleClass);
        panel.classList.add("close");
        panel.classList.remove("show");
        setTimeout(() => {
            panel.classList.remove("close");
        }, 300);
    }

    function resetFilter() {
        incomplete.checked = false;
        filterBox.querySelectorAll(".content div").forEach(filterEle => {
            filterEle.classList.remove("select");
        });
        nowBookName.innerText = "世界";
        nowBook.setAttribute("data", "0");
        nowBook.src = "handbook/book/0.png";
    }

    function saveFilter() {
        filterContent["class"] = [];
        filterContent["types"] = [];
        filterContent["incomplete"] = incomplete.checked;
        filterBox.querySelectorAll(".filterClass .content div[class*='select']").forEach(selectClass => {
            filterContent["class"].push(selectClass.getAttribute("data"));
        });
        filterBox.querySelectorAll(".filterTypes .content div[class*='select']").forEach(selectType => {
            filterContent["types"].push(selectType.innerText);
        });
        filterContent["book"] = nowBook.getAttribute("data");
        closePanel("filterPanel");
        setTimeout(async () => {
            await new Promise(resolve => {
                filter();
                resolve();
            });
        });
    }

    function showInfo() {
        infoPanel.classList.toggle("show");
        if (infoPanel.classList.contains("show")) {
            moreInfoBtn.innerHTML = "&#xf00d";
            classBox.classList.add("preview");
        } else {
            moreInfoBtn.innerHTML = "&#xf129";
            classBox.classList.remove("preview");
        }
    }

    function showAlertBox(type, data = null) {
        const content = data;
        const title = alertPanel.querySelector(".title .text");
        const text = alertPanel.querySelector(".content .text");
        const tip = alertPanel.querySelector(".content .tip");
        if (type == "fruit") {
            text.style.fontSize = "25px";
            fruitInfo = fruit[content.id];
            if (!isNaN(fruitInfo[0])) {
                content.text = `捕捉20只${json[fruitInfo[0]].name}获得`;
            } else {
                content.text = fruitInfo[0];
            }
            if (fruitInfo.length != 1) {
                content.tip = fruitInfo[1];
                tip.style.display = "block";
            }
        } else if (type == "diff") {
            text.style.fontSize = "";
            content.title = "形态获取方式"
            if (typeof diff[content.id] == "object") {
                content.text = diff[content.id][0];
                content.tip = diff[content.id][1];
            } else {
                if (diff[content.id] == "") {
                    content.tip = "敬请期待";
                } else {
                    content.text = diff[content.id];
                }
            }
        } else {
            text.style.fontSize = "";
        }
        title.innerText = content.title;
        if (content["text"] != undefined) {
            text.style.display = "block";
            text.innerText = content.text;
        } else {
            text.style.display = "none";
        }
        text.innerText = content.text;
        if (content["tip"] != undefined) {
            tip.style.display = "block";
            tip.innerText = content.tip;
        } else {
            tip.style.display = "none";
        }
        if (content["showBtn"]) {
            alertPanel.classList.add("showBtn");
        } else {
            alertPanel.classList.remove("showBtn");
        }
        alertPanel.classList.add("show");
    }

    function showItemBox() {
        const itemPanel = document.getElementById("itemPanel");
        itemPanel.querySelectorAll(".box .content .item span").forEach(item => {
            const progress = collectProgress[item.classList];
            const percent = Math.floor(progress[0] / progress[1] * 10000) / 100;
            item.innerText = `${progress[0]}/${progress[1]} (${percent}%)`;
        });
        itemPanel.classList.add("show");
    }

    function loaded() {
        loading.classList.add("hide");
        let height = window.innerHeight;
        let width = window.innerWidth;
        if (height > width + (width / 10) && "ontouchstart" in window) {
            loading.classList.add("willRotate");
        }
        checkRotate(true);
        if (localStorage["notice"] != noticeVer) {
            setTimeout(() => {
                const btns = alertPanel.querySelector(".alertBtns");
                const html = btns.innerHTML;
                btns.innerHTML = html;
                const localBtn = btns.querySelector(".local");
                localBtn.innerText = "好的";
                localBtn.addEventListener("click", () => {
                    closePanel("alertPanel");
                });
                const cloudBtn = btns.querySelector(".cloud");
                cloudBtn.innerText = "不再提示";
                cloudBtn.addEventListener("click", async () => {
                    localStorage.setItem("notice", noticeVer);
                    closePanel("alertPanel");
                });
                showAlertBox("notice", noticeContent);
            }, 500);
        }
    }

    function mustLoad(urls) {
        let done = 0;
        urls.forEach(url => {
            const img = new Image();
            img.onload = img.onerror = () => {
                done++;
                if (done == urls.length) {
                    startLoadData();
                }
            }
            img.src = url;
        });
    }

    async function startLoadData() {
        let urls = [];
        if (accessToken) {
            await checkData();
        }
        Object.keys(localStorage).forEach(key => {
            if (localStorage[key] == "undefined") {
                delete(localStorage[key]);
            }
        });
        Object.keys(json).forEach(async key => {
            urls.push(
                `/avatar/${key}.png?${version[0]}`,
                `/illustration/${key}.png?${version[1]}`
            );
            let pet = json[key];
            let fruits = pet.fruit;
            if (fruits != undefined) {
                fruits.forEach(item => {
                    if (typeof item == "object") {
                        if (!urls.includes(`/fruits/${item[0]}.png?${version[2]}`)) {
                            urls.push(`/fruits/${item[0]}.png?${version[2]}`);
                        }
                    } else {
                        if (!urls.includes(`/fruits/${item}.png?${version[2]}`)) {
                            urls.push(`/fruits/${item}.png?${version[2]}`)
                        }
                    }
                });
            }
            if (pet.diff) {
                for (let i = 1; i <= pet.diff; i++) {
                    urls.push(
                        `/avatar/${key}-${i}.png?${version[0]}`,
                        `/illustration/${key}-${i}.png?${version[1]}`
                    );
                    if (pet.yise) {
                        urls.push(
                            `/avatar/${key}-${i}-异色.png?${version[0]}`,
                            `/illustration/${key}-${i}-异色.png?${version[1]}`
                        );
                    }
                }
            }
            if (pet.lead) {
                if (typeof pet.lead == "boolean") {
                    urls.push(
                        `/avatar/${key}-首领.png?${version[0]}`,
                        `/illustration/${key}-首领.png?${version[1]}`
                    );
                    if (pet.yise) {
                        urls.push(
                            `/avatar/${key}-首领-异色.png?${version[0]}`,
                            `/illustration/${key}-首领-异色.png?${version[1]}`
                        );
                    }
                } else {
                    for (let i = 1; i <= pet.lead; i++) {
                        urls.push(
                            `/avatar/${key}-首领${i}.png?${version[0]}`,
                            `/illustration/${key}-首领${i}.png?${version[1]}`
                        );
                        if (pet.yise) {
                            `/avatar/${key}-首领${i}-异色.png?${version[0]}`,
                            `/illustration/${key}-首领${i}-异色.png?${version[1]}`
                        }
                    }
                }
            }
            if (pet.yise) {
                urls.push(
                    `/avatar/${key}-异色.png?${version[0]}`,
                    `/illustration/${key}-异色.png?${version[1]}`
                );
            }
            let petBox = document.createElement("div");
            petBox.classList.add("petBox");
            let info = document.createElement("div");
            info.classList.add("info");
            let id = document.createElement("p");
            id.classList.add("id");
            id.innerText = key.slice(1);
            id.setAttribute("key", key);
            let name = document.createElement("p");
            name.classList.add("name");
            name.innerText = pet.name;
            let avatarBox = document.createElement("div");
            avatarBox.classList.add("avatarBox");
            let avatar = document.createElement("img");
            avatar.classList.add("avatar");
            avatar.src = `avatar/${key}.png?${version[0]}`;
            let progress = document.createElement("p");
            progress.classList.add("progress");
            let selectBG = document.createElement("div");
            selectBG.classList.add("selectBG");
            let all = pet.class;
            let allL = all.length;
            if (allL == 0) {
                progress.innerText = "";
            } else {
                if (all[all.length - 1][0] == "11") {
                    allL += all[all.length - 1][1].length - 1;
                }
                let finish = JSON.parse(localStorage.getItem(key)) || [];
                let finishL = 0;
                all.forEach(item => {
                    let point = 0;
                    let collect = ["", 0];
                    switch (item[0]) {
                        case "1":
                            point = 5;
                            collect = ["exp", 150];
                            break;
                        case "2":
                            point = 10;
                            collect = ["exp", 150];
                            break;
                        case "3":
                            point = 10;
                            collect = ["crystal", 50];
                            break;
                        case "4":
                            point = 50;
                            collect = ["recipe", 1];
                            break;
                        case "5":
                            point = 20;
                            collect = ["fruit", 1];
                            break;
                        case "6":
                            point = 30;
                            collect = ["soul", 1];
                            break;
                        case "7":
                            point = 50;
                            collect = ["soul", 1];
                            break;
                        case "8":
                            point = 20;
                            collect = ["star", 1];
                            break;
                        case "9":
                            point = 30;
                            collect = ["star", 1];
                            break;
                        case "10":
                            point = 50;
                            collect = ["crystal", 300];
                            break;
                        case "11":
                            point = item[1].length * 10;
                            collect = ["skill", item[1].length];
                            break;
                    }
                    pointProgress[1] += point;
                    if (collect[0] != "recipe") {
                        collectProgress[collect[0]][1] += collect[1];
                    }
                    try {
                        finish.forEach(finItem => {
                            if (finItem[0] == item[0]) {
                                if (item[0] == "11") {
                                    item[1].forEach(skill => {
                                        if (finItem[1].includes(skill[1])) {
                                            finishL++;
                                        }
                                    });
                                } else {
                                    finishL++;
                                }
                                pointProgress[0] += point;
                                if (collect[0] != "recipe") {
                                    collectProgress[collect[0]][0] += collect[1];
                                }
                            }
                        });
                    } catch (err) {
                        console.error(err.message);
                    }
                });
                if (finishL == allL && allL != 0) {
                    progress.innerText = "完成";
                    progress.classList.add("finish");
                } else {
                    progress.innerText = `${finishL}/${allL}`;
                    progress.classList.remove("finish");
                }
                classProgress[0] += finishL;
                classProgress[1] += allL;
            }
            info.appendChild(id);
            info.appendChild(name);
            petBox.appendChild(info);
            avatarBox.appendChild(avatar);
            petBox.appendChild(avatarBox);
            petBox.appendChild(progress);
            petBox.appendChild(selectBG);
            petList.appendChild(petBox);
            petBox.addEventListener("click", () => {
                setClass(petBox, key);
            })
            if (key == "0001") {
                setClass(petBox, key);
            }
        });
        if (window.location.host != "127.0.0.1:3000" && noNetworkText.style.display != "") preload(urls);
        const classPercent = Math.floor(classProgress[0] / classProgress[1] * 10000) / 100;
        classProgressEle.innerText = `${classProgress[0]}/${classProgress[1]} (${classPercent}%)`;
        const pointPercent = Math.floor(pointProgress[0] / pointProgress[1] * 10000) / 100;
        pointProgressEle.innerText = `${pointProgress[0]}/${pointProgress[1]} (${pointPercent}%)`;
        loaded();
    }

    search.addEventListener("keydown", (e) => {
        const keyEvent = e;
        if (keyEvent["keyCode"] == 13) {
            search.blur();
        }
    })

    search.addEventListener("change", async () => {
        await new Promise(resolve => {
            filter();
            resolve();
        });
    });

    dataBtn.addEventListener("click", () => dataBox.parentElement.classList.add("show"));

    dataBox.querySelector(".enterKey button").addEventListener("click", async function() {
        const inputEle = dataBox.querySelector(".enterKey input");
        accessToken = inputEle.value;
        inputEle.value = "";
        localStorage.setItem("cloudSaveToken", accessToken);
        dataBox.classList.remove("enterKey");
        dataBox.classList.add("logging");
        userNameText.innerText = "正在获取";
        syncText.innerText = "等待同步";
        syncText.style.color = "";
        userName = await getUserName();
        dataBox.classList.remove("logging");
        dataBox.classList.add("logged");
        userNameText.innerText = userName;
        checkData(false);
    });

    dataBox.querySelector(".loginBtn").addEventListener("click", async function() {
        dataBox.classList.add("loginWay");
    });

    dataBox.querySelector(".loginWay .oauth").addEventListener("click", async function() {
        async function checkLogin() {
            let response = await fetch("https://api.errorawa.dpdns.org/roco", {
                method: "POST",
                credentials: "include"
            });
            if (response.status == 200) {
                deleteCookie();
                accessToken = await response.text();
                localStorage.setItem("cloudSaveToken", accessToken);
                dataBox.classList.remove("waitLogin");
                dataBox.classList.add("logging");
                userNameText.innerText = "正在获取";
                syncText.innerText = "等待同步";
                syncText.style.color = "";
                userName = await getUserName();
                dataBox.classList.remove("logging");
                dataBox.classList.add("logged");
                userNameText.innerText = userName;
                checkData(false);
            } else {
                setTimeout(checkLogin, 2000);
            }
        }
        dataBox.classList.remove("loginWay");
        dataBox.classList.add("waitLogin");
        window.open("https://gitee.com/oauth/authorize?client_id=edaec2ca6afbf75cea48e3fda3b7c4e5a433f55793472ee4a2db2bcb58891c4c&redirect_uri=https%3A%2F%2Fapi.errorawa.dpdns.org%2Froco&response_type=code");
        await deleteCookie();
        setTimeout(checkLogin, 2000);
    });

    dataBox.querySelector(".loginWay .inputKey").addEventListener("click", function() {
        dataBox.classList.remove("loginWay");
        dataBox.classList.add("enterKey");
        window.open("https://gitee.com/personal_access_tokens");
    });

    dataBox.querySelector(".logout").addEventListener("click", () => {
        localStorage.removeItem("cloudSaveToken");
        accessToken = "";
        userName = "";
        userNameText.innerText = "未登录";
        dataBox.classList.remove("logged");
    })

    dataBox.querySelector(".clearData").addEventListener("click", async () => {
        const btns = alertPanel.querySelector(".alertBtns");
        const html = btns.innerHTML;
        btns.innerHTML = html;
        const localBtn = btns.querySelector(".local");
        localBtn.innerText = "取消";
        localBtn.addEventListener("click", () => {
            closePanel("alertPanel");
        });
        const cloudBtn = btns.querySelector(".cloud");
        cloudBtn.innerText = "确认";
        cloudBtn.addEventListener("click", async () => {
            closePanel("alertPanel");
            closePanel("dataPanel");
            localStorage.clear();
            if (accessToken) {
                localStorage.setItem("cloudSaveToken", accessToken);
                await uploadDataFile();
            }
            location.reload();
        });
        const data = { title: "清除数据", text: "该操作不可逆，请再次确认是否清除数据", showBtn: true };
        if (accessToken) {
            data.tip = "该操作将会同时清除云存档！";
        }
        showAlertBox("clearData", data);
    });

    dataBox.querySelector(".saveData").addEventListener("click", () => {
        let data = JSON.parse(JSON.stringify(localStorage));
        delete(data["cloudSaveToken"]);
        delete(data["notice"]);
        let blob = new Blob([JSON.stringify(data)], {type: "text/plain;charset=utf-8"});
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "localStorageData.json";
        a.click();
    });

    dataBox.querySelector(".loadData").addEventListener("click", () => {
        let loadFile = document.createElement("input");
        loadFile.setAttribute("type", "file");
        loadFile.addEventListener("change", (event) => {
            let reader = new FileReader();
            reader.onload = async function(event) {
                let data = JSON.parse(event.target.result);
                localStorage.clear();
                localStorage.setItem("cloudSaveToken", accessToken);
                for (let key in data) {
                    if (data.hasOwnProperty(key)) {
                        localStorage.setItem(key, data[key]);
                    }
                }
                if (accessToken) {
                    await uploadDataFile();
                }
                location.reload();
            };
            reader.readAsText(event.target.files[0]);
        });
        loadFile.click();
    });

    pointProgressEle.parentElement.addEventListener("click", showItemBox);

    filterBtn.addEventListener("click", openFilter);

    moreInfoBtn.addEventListener("click", showInfo);

    nowBook.addEventListener("click", () => filterBooks.classList.toggle("show"));

    fcBtn.addEventListener("click", async () => {
        if (!document.fullscreenElement) {
            await document.body.requestFullscreen();
            await screen.orientation.lock("landscape");
        } else {
            document.exitFullscreen();
        }
    });

    filterBox.querySelectorAll(".content div").forEach(Class => {
        Class.addEventListener("click", () => {
            if (Class.parentElement.classList.contains("selectBook")) {
                books.forEach(book => {
                    book.classList.remove("select");
                });
                Class.classList.add("select");
                nowBook.setAttribute("data", Class.getAttribute("data"));
                nowBook.src = Class.querySelector("img").src;
                nowBookName.innerText = Class.querySelector("p").innerText;
            } else if (!Class.classList.contains("selectBook")) {
                Class.classList.toggle("select");
            }
        });
    });

    document.querySelectorAll("#filterPanel .alertBtns button").forEach(alertBtn => {
        switch (alertBtn.classList.value) {
            case "reset":
                alertBtn.addEventListener("click", resetFilter);
                break;
            case "save":
                alertBtn.addEventListener("click", saveFilter);
                break;
        }
    });

    document.querySelectorAll(".panel .box .closeBtn").forEach(closeBtn => {
        closeBtn.addEventListener("click", function() {
            closePanel(closeBtn.getAttribute("data"));
        });
    });

    checkAll.addEventListener("click", () => {
        let checkboxs = petClass.querySelectorAll(".classContent input[type=checkbox]");
        const checked = petClass.querySelectorAll(".classContent input[type=checkbox]:checked");
        if (checked.length != checkboxs.length) {
            checkboxs = petClass.querySelectorAll(".classContent input[type=checkbox]:not(:checked)");
        }
        checkboxs.forEach(checkbox => {
            checkbox.parentElement.click();
        });
    });

    window.addEventListener("click", (event) => {
        if (!event.target.classList.contains("selectBook") && !event.target.classList.contains("nowBook")) {
            filterBooks.classList.remove("show");
        }
    });

    window.addEventListener("resize", () => {
        checkRotate();
    });

    window.addEventListener("load", async () => {
        dataJSON[0].forEach(dataName => {
            const data = document.createElement("script");
            data.src = `data/${dataName}.js?${nowVer}`;
            document.body.appendChild(data);
        });
        await new Promise(resolve => {
            const check = setInterval(() => {
                if (dataJSON[1].every(dataName => window[dataName])) {
                    clearInterval(check);
                    resolve();
                }
            }, 100);
        });
        await checkUpdate();
        mustLoad([
            "handbook/texture/select.png",
            "handbook/texture/SideBar.png",
            "handbook/texture/item/exp.png",
            "handbook/texture/item/point.png",
            "handbook/texture/item/recipe.png",
            "handbook/texture/item/star.png",
            "handbook/texture/item/crystal.png",
            "handbook/texture/item/stone/光.png",
            "handbook/texture/item/recipe/光.png",
            `handbook/BG/1.png?${version[3]}`,
            `avatar/0001.png?${version[0]}`,
            `illustration/0001.png?${version[1]}`,
            "typeIcon/光.png"
        ]);
    });

    console.log(new Date().getTime());
} catch (err) {
    const loading = document.getElementById("loading");
    if (!loading.classList.contains("hide")) {
        loading.querySelector(".loadText").style.display = "none";
        loading.querySelector(".loadFailed").classList.add("show");
        console.error(`加载失败\n${err.message}`);
    } else {
        console.error(err.message);
    }
}