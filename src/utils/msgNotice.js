import Favico from 'favico.js';

class FavicoNotice{
	constructor( options = {bgColor: '#BF988F', textColor: '#fff', animation: 'none'}) {
		this.badge = new Favico(options);
		this.count = 0;
		this.bind();
	}
	notice() {
		if(this.count >= 99) {
			this.count = 'n';
		} else {
			this.count++;
		}
		this.badge.badge(this.count);
	}
	bind() {
		document.addEventListener('visibilitychange', () => {
			if(!document.hidden && this.count !== '!') {
				this.reset();
			}
		})
	}
	reset() {
		this.count = 0;
		this.badge.badge(0);
		this.badge = new Favico({
			bgColor: '#BF988F',
			textColor: '#fff',
			animation: 'none'
		});
		console.log(this.count)
		// this.badge.notice(0)
	}
	errorNotice() {
		this.badge = new Favico({
			animation: 'none'
		});
		this.count = '!';
		this.badge(this.count);
	}
}

const deskTopNotice = {
	isSurpported: !!window.Notification,
	isGranted: () => {
		return Notification.permission === 'granted'
	},
	notice: (content) => {
		let n = new Notification('新消息', {
			body: content.body,
			icon: content.avatar
		});
		n.onclick = () => {
			window.focus();
			n.close();
		}
		let timer = setTimeout(() => {
			n.close();
			clearTimeout(timer);
			timer = null;
		})
	}
}

export default {
	favicoNotification: new FavicoNotice(),
	deskTopNotice
}
