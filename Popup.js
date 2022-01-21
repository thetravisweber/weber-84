class Popup {

    constructor(x, y, analyzedElement) {
        if (document.getElementsByTagName('popup')[0])
            document.getElementsByTagName('popup')[0].remove();

        this.popup = document.createElement('popup');
        this.popup.style = `left: ${x}px; top: ${y}px`;
        this.popup.append(document.createElement('popuptitle'));
        this.popup.append(document.createElement('popupbody'));
        document.body.append(this.popup);

        this.type = analyzedElement.type;
        switch (this.type) {
            case FUNCTION :
                this.setTitle(analyzedElement.toString());

                // this.setTitle(this.functionText(analyzedElement._func.toString()));
                break;
            case POINT :
                this.setTitle(analyzedElement.toString());
                // this.setTitle(`(${analyzedElement.x}, ${analyzedElement.y})`);
                break;
            case LINE :
                this.setTitle(analyzedElement.toString());
                // this.setTitle(`(${analyzedElement.x1}, ${analyzedElement.y1}) => (${analyzedElement.x2}, ${analyzedElement.y2})`);
                this.addToBody(analyzedElement.toSlopeInterceptString());
                // this.addToBody(`y = ${analyzedElement.slope()}x + ${analyzedElement.yIntercept()}`);
        }
    }

    functionText(func) {
        func = func.substring(func.indexOf('=>') + 2);
        func = 'f(x) =' + func;
        return func;
    }

    setTitle(title) {
        this.popupTitle().innerText = title;
    }

    addToBody(text) {
        this.popupBody().innerText += '\n' + text;
    }

    popupTitle() {
        return this.popup.getElementsByTagName('popuptitle')[0];
    }

    popupBody() {
        return this.popup.getElementsByTagName('popupbody')[0];
    }

    removePopup() {
        if (this.popup)
            this.popup.remove();
    }

}