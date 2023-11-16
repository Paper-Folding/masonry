// Type definitions for @paper-folding/masonry-layout
// Project: https://github.com/Paper-Folding/masonry, https://masonry.desandro.com
// Definitions by: Mark Wilson <https://github.com/m-a-wilson>, Travis Brown <https://github.com/warriorrocker>, and I, Paper Folding (later)
// Original Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

export = Masonry;

declare class Masonry {
    constructor(options?: Masonry.Options);
    constructor(selector: string | Element, options?: Masonry.Options);

    masonry?(): void;
    masonry?(eventName: string, listener: any): void;

    // layout
    layout?(changedColumns?: number): void;
    layoutItems?(items: any[], isStill?: boolean): void;
    stamp?(elements: any[]): void;
    unstamp?(elements: any[]): void;

    // add and remove items
    appended?(elements: any[]): void;
    prepended?(elements: any[]): void;
    addItems?(elements: any[]): void;
    remove?(elements: any[]): void;
    insert?(elements: any[]): void;

    // events
    on?(eventName: string, listener: any): void;
    off?(eventName: string, listener: any): void;
    once?(eventName: string, listener: any): void;

    // utilities
    reloadItems?(): void;
    destroy?(): void;
    getItemElements?(): any[];
    data?(element: Element): Masonry;
}

declare namespace Masonry {
    interface HiddenOrVisibleStyleOption {
        transform?: string | undefined;
        opacity?: number | undefined;
    }

    interface Options {
        // layout
        itemSelector?: string | undefined;
        columns?: number;
        columnWidth?: any;
        percentPosition?: boolean | undefined;
        gutter?: any;
        stamp?: string | undefined;
        fitWidth?: boolean | undefined;
        originLeft?: boolean | undefined;
        originTop?: boolean | undefined;
        horizontalOrder?: boolean | undefined;
        hiddenStyle?: HiddenOrVisibleStyleOption | undefined;
        visibleStyle?: HiddenOrVisibleStyleOption | undefined;

        // setup
        containerStyle?: {} | undefined;
        transitionDuration?: any;
        stagger?: string | number | undefined;
        resize?: boolean | undefined;
        initLayout?: boolean | undefined;
    }
}
