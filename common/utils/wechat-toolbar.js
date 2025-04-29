function hideWeChatToolbar() {
    function hide() {
        if (typeof WeixinJSBridge !== 'undefined' && WeixinJSBridge.invoke) {
            WeixinJSBridge.invoke('hideToolbar');
        }
    }

    if (typeof WeixinJSBridge === 'undefined') {
        document.addEventListener('WeixinJSBridgeReady', hide, false);
    } else {
        hide();
    }
}

export default {
    mounted() {
        // 只在 H5 平台下的微信内调用
        if (typeof window !== 'undefined' && /MicroMessenger/i.test(navigator.userAgent)) {
            hideWeChatToolbar();
        }
    }
};
