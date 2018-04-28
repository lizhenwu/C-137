import bindToolTip from '../components/Tooltip/index';

function getContainerInfo(el) {
    
    const {width, height}= window.getComputedStyle(el);

    return function() {
        const position = el.getBoundingClientRect(),
              top = position.top + window.pageYOffset - document.documentElement.clientTop,
              left = position.left + window.pageXOffset - document.documentElement.clientLeft,
              right = position.right + window.pageXOffset - document.documentElement.clientLeft;
        return {
            left,
            right,
            top,
            width: parseInt(width),
            height: parseInt(height)
        }      
    }         
}
const positionFuncs = {
    rightPosition(container) {
        return {
            left: container.left + container.width + 'px',
            top: container.top + 'px'
        }
    },
    leftPosition(container) {
        return {
            left: container.left + 'px',
            top: container.top + 'px'
        }
    },
    bottomPosition(container) {
        return {
            left: container.left + 'px',
            top: container.top + container.height + 'px'
        }
    }
}

// left和top都只获取元素的left，top值，再通过transform去调位置，不需要涉及元素的宽高
// 而bottom和right暂时涉及元素width和height所以分别设计计算函数，其实可以用getBoundingClientRect获得的right和bottom就包含
// 宽高了，以后再改吧

positionFuncs.topPosition = positionFuncs.leftPosition;
function getPositionFunc(el, placement) {
    const getContainer = getContainerInfo(el);
    return function() {
        const container = getContainer();
        const func = positionFuncs[placement + 'Position'];
        return func(container)
    }
};
export default {
    'toolTip' : {
        inserted: function(el, binding) {
            let vm;
            
            const content = binding.value;
            const placement = binding.arg;
            const getPosition = getPositionFunc(el, placement);
            const handleMouseover = function() {
                
                const position = getPosition();
                if(vm) {
                    
                    vm.positionStyle = position;
                    
                } else {
                    
                    const options = {
                        position: placement,
                        content: content,
                        positionStyle: position,
                        // timeDelay: 在binding.arg上找，延迟选项
                    };
                    vm = vm || bindToolTip(options);
                }
                clearTimeout(vm.timer);
                vm.timer = setTimeout(() => {
                    vm.visible = true;
                }, vm.timeDelay)
            },
            handleMouseout = function() {
                clearTimeout(vm.timer);
                vm.debounceClose();
            }; 
            el.addEventListener('mouseenter', handleMouseover);
            el.addEventListener('mouseleave', handleMouseout)
        }
    }
}