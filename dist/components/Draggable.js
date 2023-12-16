"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var Draggable = function (_a) {
    var children = _a.children, setScroll = _a.setScroll, setScrollPercent = _a.setScrollPercent, _b = _a.scrollDecelFactor, scrollDecelFactor = _b === void 0 ? 0.1 : _b, _c = _a.scrollSizeFactor, scrollSizeFactor = _c === void 0 ? 20 : _c;
    var scrollRef = react_1.useRef(null);
    var startYRef = react_1.useRef({ y: 0 });
    var scrollYRef = react_1.useRef({ scrollY: 0 });
    var velocityRef = react_1.useRef({ velocityY: 0 });
    function onDrag(_a) {
        var _b;
        var scrollY = _a.scrollY;
        (_b = scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current) === null || _b === void 0 ? void 0 : _b.scroll({ top: scrollY, behavior: 'auto' });
    }
    ;
    react_1.useEffect(function () {
        var _a, _b, _c;
        if (setScroll) {
            (_a = scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current) === null || _a === void 0 ? void 0 : _a.scroll({ top: setScroll, behavior: 'auto' });
        }
        else if (setScrollPercent) {
            (_b = scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current) === null || _b === void 0 ? void 0 : _b.scroll({ top: ((_c = scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current) === null || _c === void 0 ? void 0 : _c.scrollHeight) * setScrollPercent, behavior: 'auto' });
        }
    }, [setScroll]);
    var animationFrame;
    var ds;
    var scrollTarget;
    function updateScroll() {
        animationFrame = requestAnimationFrame(function () {
            var currentScroll = getCurrentScroll();
            var diff = scrollTarget - currentScroll;
            ds = scrollDecelFactor * diff;
            var newScrollY = currentScroll + ds;
            onDrag({ scrollY: newScrollY });
            if (Math.abs(ds) < 0.5) {
                cancelAnimationFrame(animationFrame);
            }
            else {
                updateScroll();
            }
        });
    }
    var onMouseDown = function (e) {
        var _a;
        cancelAnimationFrame(animationFrame);
        velocityRef.current.velocityY = 0;
        scrollTarget = 0;
        startYRef.current.y = e.clientY;
        scrollYRef.current.scrollY = ((_a = scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current) === null || _a === void 0 ? void 0 : _a.scrollTop) || 0;
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };
    var onMouseMove = function (e) {
        var scrollY = scrollYRef.current.scrollY;
        var diff = e.clientY - startYRef.current.y;
        velocityRef.current.velocityY = e.movementY;
        onDrag({ scrollY: scrollY - diff });
    };
    var onMouseUp = function () {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        var velocity = velocityRef.current.velocityY;
        scrollTarget = getCurrentScroll() - (velocity * scrollSizeFactor);
        updateScroll();
    };
    function getCurrentScroll() {
        var _a;
        return (((_a = scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current) === null || _a === void 0 ? void 0 : _a.scrollTop) || 0);
    }
    return (react_1.default.createElement("div", { ref: scrollRef, onDrag: function (e) { e.preventDefault(); }, onDragStart: function (e) { e.preventDefault(); }, draggable: false, style: {
            'height': '100%',
            'width': '100%',
            'flex': 'auto',
            'flexDirection': 'column',
            'overflowY': 'scroll',
        }, onMouseDown: onMouseDown }, children));
};
exports.default = Draggable;
