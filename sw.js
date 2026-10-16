self.addEventListener("message", async (event) => {
    let urlArray = event.data.urls;
    console.log(urlArray);
    let location = event.data.location;
    if (event.data.type == "preload") {
        event.waitUntil(
            caches.open("cache").then(async cache => {
                const cached = await cache.keys();
                let urls = [];
                let cachedURLs = [];
                for (const request of cached) {
                    cachedURLs.push(new URL(request.url).href);
                }
                for (const url of urlArray) {
                    const fullURL = new URL(location + url).href;
                    urls.push(fullURL);
                    if (cachedURLs.includes(fullURL)) {
                        let isSkip = true;
                        if (url.includes(".png")) {
                            const test = await cache.match(url);
                            if (test != undefined) {
                                if (!test.headers.get("Content-Type").includes("image")) {
                                    console.log("移除错误资源:", url);
                                    await cache.delete(url);
                                    isSkip = false;
                                }
                            }
                        }
                        if (isSkip) {
                            console.log("skip");
                            continue;
                        }
                    }
                    try {
                        const originalResponse = await fetch(url);
                        if (originalResponse.ok) {
                            if (url.includes("png") && !originalResponse.headers.get("Content-Type").includes("image")) {
                                continue;
                            }
                            const body = await originalResponse.blob();
                            const safeResponse = new Response(body, {
                                status: originalResponse.status,
                                statusText: originalResponse.statusText,
                                headers: {
                                    "Content-Type": originalResponse.headers.get("Content-Type"),
                                    "Content-Length": body.size,
                                    "Cache-Control": "public, max-age=31536000"
                                }
                            });
                            await cache.put(url, safeResponse);
                        }
                    } catch (err) {
                        console.warn(url, "缓存失败:", err);
                    }
                }
                for (const request of cached) {
                    let reqUrl = new URL(request.url);
                    if (!urls.includes(reqUrl.href)) {
                        console.log("删除", reqUrl.href);
                        await cache.delete(request);
                    }
                }
            })
        );
    } else if (event.data.type == "reload") {
        console.log("重新加载页面");
        caches.open("cache").then(async cache => {
            await cache.delete("/");
            event.source.postMessage({
                type: "reload"
            });
        });
    }
});

self.addEventListener("fetch", (event) => {
    if (event.request.url.includes("updateTime") || event.request.url.includes("updateSW")) return;
    if (event.request.method == "GET") {
        event.respondWith(
            caches.match(event.request).then( cached => 
                cached || fetch(event.request)
            ).catch( err => {
                console.warn(event.request.url, "fetch失败:", err);
                return new Response("fetch失败", { status: 503, statusText: err });
            })
        );
    }
});