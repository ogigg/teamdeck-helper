
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.46.4 */

    const { Error: Error_1$2, Object: Object_1, console: console_1$1 } = globals;

    // (251:0) {:else}
    function create_else_block$3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(251:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (244:0) {#if componentParams}
    function create_if_block$8(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(244:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$8, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1$2("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.__svelte_spa_router_scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.__svelte_spa_router_scrollX, previousScrollState.__svelte_spa_router_scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$p, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get routes() {
    		throw new Error_1$2("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1$2("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1$2("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1$2("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1$2("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1$2("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign$1 = function() {
        __assign$1 = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign$1.apply(this, arguments);
    };

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCFoundation = /** @class */ (function () {
        function MDCFoundation(adapter) {
            if (adapter === void 0) { adapter = {}; }
            this.adapter = adapter;
        }
        Object.defineProperty(MDCFoundation, "cssClasses", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports every
                // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "strings", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "numbers", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "defaultAdapter", {
            get: function () {
                // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
                // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
                // validation.
                return {};
            },
            enumerable: false,
            configurable: true
        });
        MDCFoundation.prototype.init = function () {
            // Subclasses should override this method to perform initialization routines (registering events, etc.)
        };
        MDCFoundation.prototype.destroy = function () {
            // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
        };
        return MDCFoundation;
    }());

    /**
     * @license
     * Copyright 2019 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * Determine whether the current browser supports passive event listeners, and
     * if so, use them.
     */
    function applyPassive$1(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        return supportsPassiveOption(globalObj) ?
            { passive: true } :
            false;
    }
    function supportsPassiveOption(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        // See
        // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
        var passiveSupported = false;
        try {
            var options = {
                // This function will be called when the browser
                // attempts to access the passive property.
                get passive() {
                    passiveSupported = true;
                    return false;
                }
            };
            var handler = function () { };
            globalObj.document.addEventListener('test', handler, options);
            globalObj.document.removeEventListener('test', handler, options);
        }
        catch (err) {
            passiveSupported = false;
        }
        return passiveSupported;
    }

    var events = /*#__PURE__*/Object.freeze({
        __proto__: null,
        applyPassive: applyPassive$1
    });

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * @fileoverview A "ponyfill" is a polyfill that doesn't modify the global prototype chain.
     * This makes ponyfills safer than traditional polyfills, especially for libraries like MDC.
     */
    function closest(element, selector) {
        if (element.closest) {
            return element.closest(selector);
        }
        var el = element;
        while (el) {
            if (matches$1(el, selector)) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }
    function matches$1(element, selector) {
        var nativeMatches = element.matches
            || element.webkitMatchesSelector
            || element.msMatchesSelector;
        return nativeMatches.call(element, selector);
    }
    /**
     * Used to compute the estimated scroll width of elements. When an element is
     * hidden due to display: none; being applied to a parent element, the width is
     * returned as 0. However, the element will have a true width once no longer
     * inside a display: none context. This method computes an estimated width when
     * the element is hidden or returns the true width when the element is visble.
     * @param {Element} element the element whose width to estimate
     */
    function estimateScrollWidth(element) {
        // Check the offsetParent. If the element inherits display: none from any
        // parent, the offsetParent property will be null (see
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent).
        // This check ensures we only clone the node when necessary.
        var htmlEl = element;
        if (htmlEl.offsetParent !== null) {
            return htmlEl.scrollWidth;
        }
        var clone = htmlEl.cloneNode(true);
        clone.style.setProperty('position', 'absolute');
        clone.style.setProperty('transform', 'translate(-9999px, -9999px)');
        document.documentElement.appendChild(clone);
        var scrollWidth = clone.scrollWidth;
        document.documentElement.removeChild(clone);
        return scrollWidth;
    }

    var ponyfill = /*#__PURE__*/Object.freeze({
        __proto__: null,
        closest: closest,
        matches: matches$1,
        estimateScrollWidth: estimateScrollWidth
    });

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$8 = {
        LABEL_FLOAT_ABOVE: 'mdc-floating-label--float-above',
        LABEL_REQUIRED: 'mdc-floating-label--required',
        LABEL_SHAKE: 'mdc-floating-label--shake',
        ROOT: 'mdc-floating-label',
    };

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCFloatingLabelFoundation = /** @class */ (function (_super) {
        __extends(MDCFloatingLabelFoundation, _super);
        function MDCFloatingLabelFoundation(adapter) {
            var _this = _super.call(this, __assign$1(__assign$1({}, MDCFloatingLabelFoundation.defaultAdapter), adapter)) || this;
            _this.shakeAnimationEndHandler = function () {
                _this.handleShakeAnimationEnd();
            };
            return _this;
        }
        Object.defineProperty(MDCFloatingLabelFoundation, "cssClasses", {
            get: function () {
                return cssClasses$8;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFloatingLabelFoundation, "defaultAdapter", {
            /**
             * See {@link MDCFloatingLabelAdapter} for typing information on parameters and return types.
             */
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
                return {
                    addClass: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    getWidth: function () { return 0; },
                    registerInteractionHandler: function () { return undefined; },
                    deregisterInteractionHandler: function () { return undefined; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        MDCFloatingLabelFoundation.prototype.init = function () {
            this.adapter.registerInteractionHandler('animationend', this.shakeAnimationEndHandler);
        };
        MDCFloatingLabelFoundation.prototype.destroy = function () {
            this.adapter.deregisterInteractionHandler('animationend', this.shakeAnimationEndHandler);
        };
        /**
         * Returns the width of the label element.
         */
        MDCFloatingLabelFoundation.prototype.getWidth = function () {
            return this.adapter.getWidth();
        };
        /**
         * Styles the label to produce a shake animation to indicate an error.
         * @param shouldShake If true, adds the shake CSS class; otherwise, removes shake class.
         */
        MDCFloatingLabelFoundation.prototype.shake = function (shouldShake) {
            var LABEL_SHAKE = MDCFloatingLabelFoundation.cssClasses.LABEL_SHAKE;
            if (shouldShake) {
                this.adapter.addClass(LABEL_SHAKE);
            }
            else {
                this.adapter.removeClass(LABEL_SHAKE);
            }
        };
        /**
         * Styles the label to float or dock.
         * @param shouldFloat If true, adds the float CSS class; otherwise, removes float and shake classes to dock the label.
         */
        MDCFloatingLabelFoundation.prototype.float = function (shouldFloat) {
            var _a = MDCFloatingLabelFoundation.cssClasses, LABEL_FLOAT_ABOVE = _a.LABEL_FLOAT_ABOVE, LABEL_SHAKE = _a.LABEL_SHAKE;
            if (shouldFloat) {
                this.adapter.addClass(LABEL_FLOAT_ABOVE);
            }
            else {
                this.adapter.removeClass(LABEL_FLOAT_ABOVE);
                this.adapter.removeClass(LABEL_SHAKE);
            }
        };
        /**
         * Styles the label as required.
         * @param isRequired If true, adds an asterisk to the label, indicating that it is required.
         */
        MDCFloatingLabelFoundation.prototype.setRequired = function (isRequired) {
            var LABEL_REQUIRED = MDCFloatingLabelFoundation.cssClasses.LABEL_REQUIRED;
            if (isRequired) {
                this.adapter.addClass(LABEL_REQUIRED);
            }
            else {
                this.adapter.removeClass(LABEL_REQUIRED);
            }
        };
        MDCFloatingLabelFoundation.prototype.handleShakeAnimationEnd = function () {
            var LABEL_SHAKE = MDCFloatingLabelFoundation.cssClasses.LABEL_SHAKE;
            this.adapter.removeClass(LABEL_SHAKE);
        };
        return MDCFloatingLabelFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$7 = {
        LINE_RIPPLE_ACTIVE: 'mdc-line-ripple--active',
        LINE_RIPPLE_DEACTIVATING: 'mdc-line-ripple--deactivating',
    };

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCLineRippleFoundation = /** @class */ (function (_super) {
        __extends(MDCLineRippleFoundation, _super);
        function MDCLineRippleFoundation(adapter) {
            var _this = _super.call(this, __assign$1(__assign$1({}, MDCLineRippleFoundation.defaultAdapter), adapter)) || this;
            _this.transitionEndHandler = function (evt) {
                _this.handleTransitionEnd(evt);
            };
            return _this;
        }
        Object.defineProperty(MDCLineRippleFoundation, "cssClasses", {
            get: function () {
                return cssClasses$7;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCLineRippleFoundation, "defaultAdapter", {
            /**
             * See {@link MDCLineRippleAdapter} for typing information on parameters and return types.
             */
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
                return {
                    addClass: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    hasClass: function () { return false; },
                    setStyle: function () { return undefined; },
                    registerEventHandler: function () { return undefined; },
                    deregisterEventHandler: function () { return undefined; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        MDCLineRippleFoundation.prototype.init = function () {
            this.adapter.registerEventHandler('transitionend', this.transitionEndHandler);
        };
        MDCLineRippleFoundation.prototype.destroy = function () {
            this.adapter.deregisterEventHandler('transitionend', this.transitionEndHandler);
        };
        MDCLineRippleFoundation.prototype.activate = function () {
            this.adapter.removeClass(cssClasses$7.LINE_RIPPLE_DEACTIVATING);
            this.adapter.addClass(cssClasses$7.LINE_RIPPLE_ACTIVE);
        };
        MDCLineRippleFoundation.prototype.setRippleCenter = function (xCoordinate) {
            this.adapter.setStyle('transform-origin', xCoordinate + "px center");
        };
        MDCLineRippleFoundation.prototype.deactivate = function () {
            this.adapter.addClass(cssClasses$7.LINE_RIPPLE_DEACTIVATING);
        };
        MDCLineRippleFoundation.prototype.handleTransitionEnd = function (evt) {
            // Wait for the line ripple to be either transparent or opaque
            // before emitting the animation end event
            var isDeactivating = this.adapter.hasClass(cssClasses$7.LINE_RIPPLE_DEACTIVATING);
            if (evt.propertyName === 'opacity') {
                if (isDeactivating) {
                    this.adapter.removeClass(cssClasses$7.LINE_RIPPLE_ACTIVE);
                    this.adapter.removeClass(cssClasses$7.LINE_RIPPLE_DEACTIVATING);
                }
            }
        };
        return MDCLineRippleFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var strings$4 = {
        NOTCH_ELEMENT_SELECTOR: '.mdc-notched-outline__notch',
    };
    var numbers$3 = {
        // This should stay in sync with $mdc-notched-outline-padding * 2.
        NOTCH_ELEMENT_PADDING: 8,
    };
    var cssClasses$6 = {
        NO_LABEL: 'mdc-notched-outline--no-label',
        OUTLINE_NOTCHED: 'mdc-notched-outline--notched',
        OUTLINE_UPGRADED: 'mdc-notched-outline--upgraded',
    };

    /**
     * @license
     * Copyright 2017 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCNotchedOutlineFoundation = /** @class */ (function (_super) {
        __extends(MDCNotchedOutlineFoundation, _super);
        function MDCNotchedOutlineFoundation(adapter) {
            return _super.call(this, __assign$1(__assign$1({}, MDCNotchedOutlineFoundation.defaultAdapter), adapter)) || this;
        }
        Object.defineProperty(MDCNotchedOutlineFoundation, "strings", {
            get: function () {
                return strings$4;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCNotchedOutlineFoundation, "cssClasses", {
            get: function () {
                return cssClasses$6;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCNotchedOutlineFoundation, "numbers", {
            get: function () {
                return numbers$3;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCNotchedOutlineFoundation, "defaultAdapter", {
            /**
             * See {@link MDCNotchedOutlineAdapter} for typing information on parameters and return types.
             */
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
                return {
                    addClass: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    setNotchWidthProperty: function () { return undefined; },
                    removeNotchWidthProperty: function () { return undefined; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Adds the outline notched selector and updates the notch width calculated based off of notchWidth.
         */
        MDCNotchedOutlineFoundation.prototype.notch = function (notchWidth) {
            var OUTLINE_NOTCHED = MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED;
            if (notchWidth > 0) {
                notchWidth += numbers$3.NOTCH_ELEMENT_PADDING; // Add padding from left/right.
            }
            this.adapter.setNotchWidthProperty(notchWidth);
            this.adapter.addClass(OUTLINE_NOTCHED);
        };
        /**
         * Removes notched outline selector to close the notch in the outline.
         */
        MDCNotchedOutlineFoundation.prototype.closeNotch = function () {
            var OUTLINE_NOTCHED = MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED;
            this.adapter.removeClass(OUTLINE_NOTCHED);
            this.adapter.removeNotchWidthProperty();
        };
        return MDCNotchedOutlineFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$5 = {
        // Ripple is a special case where the "root" component is really a "mixin" of sorts,
        // given that it's an 'upgrade' to an existing component. That being said it is the root
        // CSS class that all other CSS classes derive from.
        BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',
        FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',
        FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation',
        ROOT: 'mdc-ripple-upgraded',
        UNBOUNDED: 'mdc-ripple-upgraded--unbounded',
    };
    var strings$3 = {
        VAR_FG_SCALE: '--mdc-ripple-fg-scale',
        VAR_FG_SIZE: '--mdc-ripple-fg-size',
        VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end',
        VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',
        VAR_LEFT: '--mdc-ripple-left',
        VAR_TOP: '--mdc-ripple-top',
    };
    var numbers$2 = {
        DEACTIVATION_TIMEOUT_MS: 225,
        FG_DEACTIVATION_MS: 150,
        INITIAL_ORIGIN_SCALE: 0.6,
        PADDING: 10,
        TAP_DELAY_MS: 300, // Delay between touch and simulated mouse events on touch devices
    };

    /**
     * Stores result from supportsCssVariables to avoid redundant processing to
     * detect CSS custom variable support.
     */
    var supportsCssVariables_;
    function supportsCssVariables(windowObj, forceRefresh) {
        if (forceRefresh === void 0) { forceRefresh = false; }
        var CSS = windowObj.CSS;
        var supportsCssVars = supportsCssVariables_;
        if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {
            return supportsCssVariables_;
        }
        var supportsFunctionPresent = CSS && typeof CSS.supports === 'function';
        if (!supportsFunctionPresent) {
            return false;
        }
        var explicitlySupportsCssVars = CSS.supports('--css-vars', 'yes');
        // See: https://bugs.webkit.org/show_bug.cgi?id=154669
        // See: README section on Safari
        var weAreFeatureDetectingSafari10plus = (CSS.supports('(--css-vars: yes)') &&
            CSS.supports('color', '#00000000'));
        supportsCssVars =
            explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus;
        if (!forceRefresh) {
            supportsCssVariables_ = supportsCssVars;
        }
        return supportsCssVars;
    }
    function getNormalizedEventCoords(evt, pageOffset, clientRect) {
        if (!evt) {
            return { x: 0, y: 0 };
        }
        var x = pageOffset.x, y = pageOffset.y;
        var documentX = x + clientRect.left;
        var documentY = y + clientRect.top;
        var normalizedX;
        var normalizedY;
        // Determine touch point relative to the ripple container.
        if (evt.type === 'touchstart') {
            var touchEvent = evt;
            normalizedX = touchEvent.changedTouches[0].pageX - documentX;
            normalizedY = touchEvent.changedTouches[0].pageY - documentY;
        }
        else {
            var mouseEvent = evt;
            normalizedX = mouseEvent.pageX - documentX;
            normalizedY = mouseEvent.pageY - documentY;
        }
        return { x: normalizedX, y: normalizedY };
    }

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    // Activation events registered on the root element of each instance for activation
    var ACTIVATION_EVENT_TYPES = [
        'touchstart', 'pointerdown', 'mousedown', 'keydown',
    ];
    // Deactivation events registered on documentElement when a pointer-related down event occurs
    var POINTER_DEACTIVATION_EVENT_TYPES = [
        'touchend', 'pointerup', 'mouseup', 'contextmenu',
    ];
    // simultaneous nested activations
    var activatedTargets = [];
    var MDCRippleFoundation = /** @class */ (function (_super) {
        __extends(MDCRippleFoundation, _super);
        function MDCRippleFoundation(adapter) {
            var _this = _super.call(this, __assign$1(__assign$1({}, MDCRippleFoundation.defaultAdapter), adapter)) || this;
            _this.activationAnimationHasEnded = false;
            _this.activationTimer = 0;
            _this.fgDeactivationRemovalTimer = 0;
            _this.fgScale = '0';
            _this.frame = { width: 0, height: 0 };
            _this.initialSize = 0;
            _this.layoutFrame = 0;
            _this.maxRadius = 0;
            _this.unboundedCoords = { left: 0, top: 0 };
            _this.activationState = _this.defaultActivationState();
            _this.activationTimerCallback = function () {
                _this.activationAnimationHasEnded = true;
                _this.runDeactivationUXLogicIfReady();
            };
            _this.activateHandler = function (e) {
                _this.activateImpl(e);
            };
            _this.deactivateHandler = function () {
                _this.deactivateImpl();
            };
            _this.focusHandler = function () {
                _this.handleFocus();
            };
            _this.blurHandler = function () {
                _this.handleBlur();
            };
            _this.resizeHandler = function () {
                _this.layout();
            };
            return _this;
        }
        Object.defineProperty(MDCRippleFoundation, "cssClasses", {
            get: function () {
                return cssClasses$5;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "strings", {
            get: function () {
                return strings$3;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "numbers", {
            get: function () {
                return numbers$2;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "defaultAdapter", {
            get: function () {
                return {
                    addClass: function () { return undefined; },
                    browserSupportsCssVars: function () { return true; },
                    computeBoundingRect: function () {
                        return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 });
                    },
                    containsEventTarget: function () { return true; },
                    deregisterDocumentInteractionHandler: function () { return undefined; },
                    deregisterInteractionHandler: function () { return undefined; },
                    deregisterResizeHandler: function () { return undefined; },
                    getWindowPageOffset: function () { return ({ x: 0, y: 0 }); },
                    isSurfaceActive: function () { return true; },
                    isSurfaceDisabled: function () { return true; },
                    isUnbounded: function () { return true; },
                    registerDocumentInteractionHandler: function () { return undefined; },
                    registerInteractionHandler: function () { return undefined; },
                    registerResizeHandler: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    updateCssVariable: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        MDCRippleFoundation.prototype.init = function () {
            var _this = this;
            var supportsPressRipple = this.supportsPressRipple();
            this.registerRootHandlers(supportsPressRipple);
            if (supportsPressRipple) {
                var _a = MDCRippleFoundation.cssClasses, ROOT_1 = _a.ROOT, UNBOUNDED_1 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.addClass(ROOT_1);
                    if (_this.adapter.isUnbounded()) {
                        _this.adapter.addClass(UNBOUNDED_1);
                        // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple
                        _this.layoutInternal();
                    }
                });
            }
        };
        MDCRippleFoundation.prototype.destroy = function () {
            var _this = this;
            if (this.supportsPressRipple()) {
                if (this.activationTimer) {
                    clearTimeout(this.activationTimer);
                    this.activationTimer = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_ACTIVATION);
                }
                if (this.fgDeactivationRemovalTimer) {
                    clearTimeout(this.fgDeactivationRemovalTimer);
                    this.fgDeactivationRemovalTimer = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_DEACTIVATION);
                }
                var _a = MDCRippleFoundation.cssClasses, ROOT_2 = _a.ROOT, UNBOUNDED_2 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.removeClass(ROOT_2);
                    _this.adapter.removeClass(UNBOUNDED_2);
                    _this.removeCssVars();
                });
            }
            this.deregisterRootHandlers();
            this.deregisterDeactivationHandlers();
        };
        /**
         * @param evt Optional event containing position information.
         */
        MDCRippleFoundation.prototype.activate = function (evt) {
            this.activateImpl(evt);
        };
        MDCRippleFoundation.prototype.deactivate = function () {
            this.deactivateImpl();
        };
        MDCRippleFoundation.prototype.layout = function () {
            var _this = this;
            if (this.layoutFrame) {
                cancelAnimationFrame(this.layoutFrame);
            }
            this.layoutFrame = requestAnimationFrame(function () {
                _this.layoutInternal();
                _this.layoutFrame = 0;
            });
        };
        MDCRippleFoundation.prototype.setUnbounded = function (unbounded) {
            var UNBOUNDED = MDCRippleFoundation.cssClasses.UNBOUNDED;
            if (unbounded) {
                this.adapter.addClass(UNBOUNDED);
            }
            else {
                this.adapter.removeClass(UNBOUNDED);
            }
        };
        MDCRippleFoundation.prototype.handleFocus = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        MDCRippleFoundation.prototype.handleBlur = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        /**
         * We compute this property so that we are not querying information about the client
         * until the point in time where the foundation requests it. This prevents scenarios where
         * client-side feature-detection may happen too early, such as when components are rendered on the server
         * and then initialized at mount time on the client.
         */
        MDCRippleFoundation.prototype.supportsPressRipple = function () {
            return this.adapter.browserSupportsCssVars();
        };
        MDCRippleFoundation.prototype.defaultActivationState = function () {
            return {
                activationEvent: undefined,
                hasDeactivationUXRun: false,
                isActivated: false,
                isProgrammatic: false,
                wasActivatedByPointer: false,
                wasElementMadeActive: false,
            };
        };
        /**
         * supportsPressRipple Passed from init to save a redundant function call
         */
        MDCRippleFoundation.prototype.registerRootHandlers = function (supportsPressRipple) {
            var e_1, _a;
            if (supportsPressRipple) {
                try {
                    for (var ACTIVATION_EVENT_TYPES_1 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next(); !ACTIVATION_EVENT_TYPES_1_1.done; ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next()) {
                        var evtType = ACTIVATION_EVENT_TYPES_1_1.value;
                        this.adapter.registerInteractionHandler(evtType, this.activateHandler);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (ACTIVATION_EVENT_TYPES_1_1 && !ACTIVATION_EVENT_TYPES_1_1.done && (_a = ACTIVATION_EVENT_TYPES_1.return)) _a.call(ACTIVATION_EVENT_TYPES_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if (this.adapter.isUnbounded()) {
                    this.adapter.registerResizeHandler(this.resizeHandler);
                }
            }
            this.adapter.registerInteractionHandler('focus', this.focusHandler);
            this.adapter.registerInteractionHandler('blur', this.blurHandler);
        };
        MDCRippleFoundation.prototype.registerDeactivationHandlers = function (evt) {
            var e_2, _a;
            if (evt.type === 'keydown') {
                this.adapter.registerInteractionHandler('keyup', this.deactivateHandler);
            }
            else {
                try {
                    for (var POINTER_DEACTIVATION_EVENT_TYPES_1 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next(); !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done; POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next()) {
                        var evtType = POINTER_DEACTIVATION_EVENT_TYPES_1_1.value;
                        this.adapter.registerDocumentInteractionHandler(evtType, this.deactivateHandler);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (POINTER_DEACTIVATION_EVENT_TYPES_1_1 && !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_1.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        };
        MDCRippleFoundation.prototype.deregisterRootHandlers = function () {
            var e_3, _a;
            try {
                for (var ACTIVATION_EVENT_TYPES_2 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next(); !ACTIVATION_EVENT_TYPES_2_1.done; ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next()) {
                    var evtType = ACTIVATION_EVENT_TYPES_2_1.value;
                    this.adapter.deregisterInteractionHandler(evtType, this.activateHandler);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (ACTIVATION_EVENT_TYPES_2_1 && !ACTIVATION_EVENT_TYPES_2_1.done && (_a = ACTIVATION_EVENT_TYPES_2.return)) _a.call(ACTIVATION_EVENT_TYPES_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
            this.adapter.deregisterInteractionHandler('focus', this.focusHandler);
            this.adapter.deregisterInteractionHandler('blur', this.blurHandler);
            if (this.adapter.isUnbounded()) {
                this.adapter.deregisterResizeHandler(this.resizeHandler);
            }
        };
        MDCRippleFoundation.prototype.deregisterDeactivationHandlers = function () {
            var e_4, _a;
            this.adapter.deregisterInteractionHandler('keyup', this.deactivateHandler);
            try {
                for (var POINTER_DEACTIVATION_EVENT_TYPES_2 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next(); !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done; POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next()) {
                    var evtType = POINTER_DEACTIVATION_EVENT_TYPES_2_1.value;
                    this.adapter.deregisterDocumentInteractionHandler(evtType, this.deactivateHandler);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (POINTER_DEACTIVATION_EVENT_TYPES_2_1 && !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_2.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_2);
                }
                finally { if (e_4) throw e_4.error; }
            }
        };
        MDCRippleFoundation.prototype.removeCssVars = function () {
            var _this = this;
            var rippleStrings = MDCRippleFoundation.strings;
            var keys = Object.keys(rippleStrings);
            keys.forEach(function (key) {
                if (key.indexOf('VAR_') === 0) {
                    _this.adapter.updateCssVariable(rippleStrings[key], null);
                }
            });
        };
        MDCRippleFoundation.prototype.activateImpl = function (evt) {
            var _this = this;
            if (this.adapter.isSurfaceDisabled()) {
                return;
            }
            var activationState = this.activationState;
            if (activationState.isActivated) {
                return;
            }
            // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction
            var previousActivationEvent = this.previousActivationEvent;
            var isSameInteraction = previousActivationEvent && evt !== undefined && previousActivationEvent.type !== evt.type;
            if (isSameInteraction) {
                return;
            }
            activationState.isActivated = true;
            activationState.isProgrammatic = evt === undefined;
            activationState.activationEvent = evt;
            activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : evt !== undefined && (evt.type === 'mousedown' || evt.type === 'touchstart' || evt.type === 'pointerdown');
            var hasActivatedChild = evt !== undefined &&
                activatedTargets.length > 0 &&
                activatedTargets.some(function (target) { return _this.adapter.containsEventTarget(target); });
            if (hasActivatedChild) {
                // Immediately reset activation state, while preserving logic that prevents touch follow-on events
                this.resetActivationState();
                return;
            }
            if (evt !== undefined) {
                activatedTargets.push(evt.target);
                this.registerDeactivationHandlers(evt);
            }
            activationState.wasElementMadeActive = this.checkElementMadeActive(evt);
            if (activationState.wasElementMadeActive) {
                this.animateActivation();
            }
            requestAnimationFrame(function () {
                // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples
                activatedTargets = [];
                if (!activationState.wasElementMadeActive
                    && evt !== undefined
                    && (evt.key === ' ' || evt.keyCode === 32)) {
                    // If space was pressed, try again within an rAF call to detect :active, because different UAs report
                    // active states inconsistently when they're called within event handling code:
                    // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971
                    // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741
                    // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS
                    // variable is set within a rAF callback for a submit button interaction (#2241).
                    activationState.wasElementMadeActive = _this.checkElementMadeActive(evt);
                    if (activationState.wasElementMadeActive) {
                        _this.animateActivation();
                    }
                }
                if (!activationState.wasElementMadeActive) {
                    // Reset activation state immediately if element was not made active.
                    _this.activationState = _this.defaultActivationState();
                }
            });
        };
        MDCRippleFoundation.prototype.checkElementMadeActive = function (evt) {
            return (evt !== undefined && evt.type === 'keydown') ?
                this.adapter.isSurfaceActive() :
                true;
        };
        MDCRippleFoundation.prototype.animateActivation = function () {
            var _this = this;
            var _a = MDCRippleFoundation.strings, VAR_FG_TRANSLATE_START = _a.VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END = _a.VAR_FG_TRANSLATE_END;
            var _b = MDCRippleFoundation.cssClasses, FG_DEACTIVATION = _b.FG_DEACTIVATION, FG_ACTIVATION = _b.FG_ACTIVATION;
            var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation.numbers.DEACTIVATION_TIMEOUT_MS;
            this.layoutInternal();
            var translateStart = '';
            var translateEnd = '';
            if (!this.adapter.isUnbounded()) {
                var _c = this.getFgTranslationCoordinates(), startPoint = _c.startPoint, endPoint = _c.endPoint;
                translateStart = startPoint.x + "px, " + startPoint.y + "px";
                translateEnd = endPoint.x + "px, " + endPoint.y + "px";
            }
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
            // Cancel any ongoing activation/deactivation animations
            clearTimeout(this.activationTimer);
            clearTimeout(this.fgDeactivationRemovalTimer);
            this.rmBoundedActivationClasses();
            this.adapter.removeClass(FG_DEACTIVATION);
            // Force layout in order to re-trigger the animation.
            this.adapter.computeBoundingRect();
            this.adapter.addClass(FG_ACTIVATION);
            this.activationTimer = setTimeout(function () {
                _this.activationTimerCallback();
            }, DEACTIVATION_TIMEOUT_MS);
        };
        MDCRippleFoundation.prototype.getFgTranslationCoordinates = function () {
            var _a = this.activationState, activationEvent = _a.activationEvent, wasActivatedByPointer = _a.wasActivatedByPointer;
            var startPoint;
            if (wasActivatedByPointer) {
                startPoint = getNormalizedEventCoords(activationEvent, this.adapter.getWindowPageOffset(), this.adapter.computeBoundingRect());
            }
            else {
                startPoint = {
                    x: this.frame.width / 2,
                    y: this.frame.height / 2,
                };
            }
            // Center the element around the start point.
            startPoint = {
                x: startPoint.x - (this.initialSize / 2),
                y: startPoint.y - (this.initialSize / 2),
            };
            var endPoint = {
                x: (this.frame.width / 2) - (this.initialSize / 2),
                y: (this.frame.height / 2) - (this.initialSize / 2),
            };
            return { startPoint: startPoint, endPoint: endPoint };
        };
        MDCRippleFoundation.prototype.runDeactivationUXLogicIfReady = function () {
            var _this = this;
            // This method is called both when a pointing device is released, and when the activation animation ends.
            // The deactivation animation should only run after both of those occur.
            var FG_DEACTIVATION = MDCRippleFoundation.cssClasses.FG_DEACTIVATION;
            var _a = this.activationState, hasDeactivationUXRun = _a.hasDeactivationUXRun, isActivated = _a.isActivated;
            var activationHasEnded = hasDeactivationUXRun || !isActivated;
            if (activationHasEnded && this.activationAnimationHasEnded) {
                this.rmBoundedActivationClasses();
                this.adapter.addClass(FG_DEACTIVATION);
                this.fgDeactivationRemovalTimer = setTimeout(function () {
                    _this.adapter.removeClass(FG_DEACTIVATION);
                }, numbers$2.FG_DEACTIVATION_MS);
            }
        };
        MDCRippleFoundation.prototype.rmBoundedActivationClasses = function () {
            var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;
            this.adapter.removeClass(FG_ACTIVATION);
            this.activationAnimationHasEnded = false;
            this.adapter.computeBoundingRect();
        };
        MDCRippleFoundation.prototype.resetActivationState = function () {
            var _this = this;
            this.previousActivationEvent = this.activationState.activationEvent;
            this.activationState = this.defaultActivationState();
            // Touch devices may fire additional events for the same interaction within a short time.
            // Store the previous event until it's safe to assume that subsequent events are for new interactions.
            setTimeout(function () { return _this.previousActivationEvent = undefined; }, MDCRippleFoundation.numbers.TAP_DELAY_MS);
        };
        MDCRippleFoundation.prototype.deactivateImpl = function () {
            var _this = this;
            var activationState = this.activationState;
            // This can happen in scenarios such as when you have a keyup event that blurs the element.
            if (!activationState.isActivated) {
                return;
            }
            var state = __assign$1({}, activationState);
            if (activationState.isProgrammatic) {
                requestAnimationFrame(function () {
                    _this.animateDeactivation(state);
                });
                this.resetActivationState();
            }
            else {
                this.deregisterDeactivationHandlers();
                requestAnimationFrame(function () {
                    _this.activationState.hasDeactivationUXRun = true;
                    _this.animateDeactivation(state);
                    _this.resetActivationState();
                });
            }
        };
        MDCRippleFoundation.prototype.animateDeactivation = function (_a) {
            var wasActivatedByPointer = _a.wasActivatedByPointer, wasElementMadeActive = _a.wasElementMadeActive;
            if (wasActivatedByPointer || wasElementMadeActive) {
                this.runDeactivationUXLogicIfReady();
            }
        };
        MDCRippleFoundation.prototype.layoutInternal = function () {
            var _this = this;
            this.frame = this.adapter.computeBoundingRect();
            var maxDim = Math.max(this.frame.height, this.frame.width);
            // Surface diameter is treated differently for unbounded vs. bounded ripples.
            // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately
            // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically
            // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter
            // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via
            // `overflow: hidden`.
            var getBoundedRadius = function () {
                var hypotenuse = Math.sqrt(Math.pow(_this.frame.width, 2) + Math.pow(_this.frame.height, 2));
                return hypotenuse + MDCRippleFoundation.numbers.PADDING;
            };
            this.maxRadius = this.adapter.isUnbounded() ? maxDim : getBoundedRadius();
            // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
            var initialSize = Math.floor(maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE);
            // Unbounded ripple size should always be even number to equally center align.
            if (this.adapter.isUnbounded() && initialSize % 2 !== 0) {
                this.initialSize = initialSize - 1;
            }
            else {
                this.initialSize = initialSize;
            }
            this.fgScale = "" + this.maxRadius / this.initialSize;
            this.updateLayoutCssVars();
        };
        MDCRippleFoundation.prototype.updateLayoutCssVars = function () {
            var _a = MDCRippleFoundation.strings, VAR_FG_SIZE = _a.VAR_FG_SIZE, VAR_LEFT = _a.VAR_LEFT, VAR_TOP = _a.VAR_TOP, VAR_FG_SCALE = _a.VAR_FG_SCALE;
            this.adapter.updateCssVariable(VAR_FG_SIZE, this.initialSize + "px");
            this.adapter.updateCssVariable(VAR_FG_SCALE, this.fgScale);
            if (this.adapter.isUnbounded()) {
                this.unboundedCoords = {
                    left: Math.round((this.frame.width / 2) - (this.initialSize / 2)),
                    top: Math.round((this.frame.height / 2) - (this.initialSize / 2)),
                };
                this.adapter.updateCssVariable(VAR_LEFT, this.unboundedCoords.left + "px");
                this.adapter.updateCssVariable(VAR_TOP, this.unboundedCoords.top + "px");
            }
        };
        return MDCRippleFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var strings$2 = {
        ARIA_CONTROLS: 'aria-controls',
        ARIA_DESCRIBEDBY: 'aria-describedby',
        INPUT_SELECTOR: '.mdc-text-field__input',
        LABEL_SELECTOR: '.mdc-floating-label',
        LEADING_ICON_SELECTOR: '.mdc-text-field__icon--leading',
        LINE_RIPPLE_SELECTOR: '.mdc-line-ripple',
        OUTLINE_SELECTOR: '.mdc-notched-outline',
        PREFIX_SELECTOR: '.mdc-text-field__affix--prefix',
        SUFFIX_SELECTOR: '.mdc-text-field__affix--suffix',
        TRAILING_ICON_SELECTOR: '.mdc-text-field__icon--trailing'
    };
    var cssClasses$4 = {
        DISABLED: 'mdc-text-field--disabled',
        FOCUSED: 'mdc-text-field--focused',
        HELPER_LINE: 'mdc-text-field-helper-line',
        INVALID: 'mdc-text-field--invalid',
        LABEL_FLOATING: 'mdc-text-field--label-floating',
        NO_LABEL: 'mdc-text-field--no-label',
        OUTLINED: 'mdc-text-field--outlined',
        ROOT: 'mdc-text-field',
        TEXTAREA: 'mdc-text-field--textarea',
        WITH_LEADING_ICON: 'mdc-text-field--with-leading-icon',
        WITH_TRAILING_ICON: 'mdc-text-field--with-trailing-icon',
        WITH_INTERNAL_COUNTER: 'mdc-text-field--with-internal-counter',
    };
    var numbers$1 = {
        LABEL_SCALE: 0.75,
    };
    /**
     * Whitelist based off of
     * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation
     * under the "Validation-related attributes" section.
     */
    var VALIDATION_ATTR_WHITELIST = [
        'pattern',
        'min',
        'max',
        'required',
        'step',
        'minlength',
        'maxlength',
    ];
    /**
     * Label should always float for these types as they show some UI even if value
     * is empty.
     */
    var ALWAYS_FLOAT_TYPES = [
        'color',
        'date',
        'datetime-local',
        'month',
        'range',
        'time',
        'week',
    ];

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var POINTERDOWN_EVENTS = ['mousedown', 'touchstart'];
    var INTERACTION_EVENTS = ['click', 'keydown'];
    var MDCTextFieldFoundation = /** @class */ (function (_super) {
        __extends(MDCTextFieldFoundation, _super);
        /**
         * @param adapter
         * @param foundationMap Map from subcomponent names to their subfoundations.
         */
        function MDCTextFieldFoundation(adapter, foundationMap) {
            if (foundationMap === void 0) { foundationMap = {}; }
            var _this = _super.call(this, __assign$1(__assign$1({}, MDCTextFieldFoundation.defaultAdapter), adapter)) || this;
            _this.isFocused = false;
            _this.receivedUserInput = false;
            _this.valid = true;
            _this.useNativeValidation = true;
            _this.validateOnValueChange = true;
            _this.helperText = foundationMap.helperText;
            _this.characterCounter = foundationMap.characterCounter;
            _this.leadingIcon = foundationMap.leadingIcon;
            _this.trailingIcon = foundationMap.trailingIcon;
            _this.inputFocusHandler = function () {
                _this.activateFocus();
            };
            _this.inputBlurHandler = function () {
                _this.deactivateFocus();
            };
            _this.inputInputHandler = function () {
                _this.handleInput();
            };
            _this.setPointerXOffset = function (evt) {
                _this.setTransformOrigin(evt);
            };
            _this.textFieldInteractionHandler = function () {
                _this.handleTextFieldInteraction();
            };
            _this.validationAttributeChangeHandler = function (attributesList) {
                _this.handleValidationAttributeChange(attributesList);
            };
            return _this;
        }
        Object.defineProperty(MDCTextFieldFoundation, "cssClasses", {
            get: function () {
                return cssClasses$4;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTextFieldFoundation, "strings", {
            get: function () {
                return strings$2;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTextFieldFoundation, "numbers", {
            get: function () {
                return numbers$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTextFieldFoundation.prototype, "shouldAlwaysFloat", {
            get: function () {
                var type = this.getNativeInput().type;
                return ALWAYS_FLOAT_TYPES.indexOf(type) >= 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTextFieldFoundation.prototype, "shouldFloat", {
            get: function () {
                return this.shouldAlwaysFloat || this.isFocused || !!this.getValue() ||
                    this.isBadInput();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTextFieldFoundation.prototype, "shouldShake", {
            get: function () {
                return !this.isFocused && !this.isValid() && !!this.getValue();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTextFieldFoundation, "defaultAdapter", {
            /**
             * See {@link MDCTextFieldAdapter} for typing information on parameters and
             * return types.
             */
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
                return {
                    addClass: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    hasClass: function () { return true; },
                    setInputAttr: function () { return undefined; },
                    removeInputAttr: function () { return undefined; },
                    registerTextFieldInteractionHandler: function () { return undefined; },
                    deregisterTextFieldInteractionHandler: function () { return undefined; },
                    registerInputInteractionHandler: function () { return undefined; },
                    deregisterInputInteractionHandler: function () { return undefined; },
                    registerValidationAttributeChangeHandler: function () {
                        return new MutationObserver(function () { return undefined; });
                    },
                    deregisterValidationAttributeChangeHandler: function () { return undefined; },
                    getNativeInput: function () { return null; },
                    isFocused: function () { return false; },
                    activateLineRipple: function () { return undefined; },
                    deactivateLineRipple: function () { return undefined; },
                    setLineRippleTransformOrigin: function () { return undefined; },
                    shakeLabel: function () { return undefined; },
                    floatLabel: function () { return undefined; },
                    setLabelRequired: function () { return undefined; },
                    hasLabel: function () { return false; },
                    getLabelWidth: function () { return 0; },
                    hasOutline: function () { return false; },
                    notchOutline: function () { return undefined; },
                    closeOutline: function () { return undefined; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        MDCTextFieldFoundation.prototype.init = function () {
            var e_1, _a, e_2, _b;
            if (this.adapter.hasLabel() && this.getNativeInput().required) {
                this.adapter.setLabelRequired(true);
            }
            if (this.adapter.isFocused()) {
                this.inputFocusHandler();
            }
            else if (this.adapter.hasLabel() && this.shouldFloat) {
                this.notchOutline(true);
                this.adapter.floatLabel(true);
                this.styleFloating(true);
            }
            this.adapter.registerInputInteractionHandler('focus', this.inputFocusHandler);
            this.adapter.registerInputInteractionHandler('blur', this.inputBlurHandler);
            this.adapter.registerInputInteractionHandler('input', this.inputInputHandler);
            try {
                for (var POINTERDOWN_EVENTS_1 = __values(POINTERDOWN_EVENTS), POINTERDOWN_EVENTS_1_1 = POINTERDOWN_EVENTS_1.next(); !POINTERDOWN_EVENTS_1_1.done; POINTERDOWN_EVENTS_1_1 = POINTERDOWN_EVENTS_1.next()) {
                    var evtType = POINTERDOWN_EVENTS_1_1.value;
                    this.adapter.registerInputInteractionHandler(evtType, this.setPointerXOffset);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (POINTERDOWN_EVENTS_1_1 && !POINTERDOWN_EVENTS_1_1.done && (_a = POINTERDOWN_EVENTS_1.return)) _a.call(POINTERDOWN_EVENTS_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            try {
                for (var INTERACTION_EVENTS_1 = __values(INTERACTION_EVENTS), INTERACTION_EVENTS_1_1 = INTERACTION_EVENTS_1.next(); !INTERACTION_EVENTS_1_1.done; INTERACTION_EVENTS_1_1 = INTERACTION_EVENTS_1.next()) {
                    var evtType = INTERACTION_EVENTS_1_1.value;
                    this.adapter.registerTextFieldInteractionHandler(evtType, this.textFieldInteractionHandler);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (INTERACTION_EVENTS_1_1 && !INTERACTION_EVENTS_1_1.done && (_b = INTERACTION_EVENTS_1.return)) _b.call(INTERACTION_EVENTS_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            this.validationObserver =
                this.adapter.registerValidationAttributeChangeHandler(this.validationAttributeChangeHandler);
            this.setcharacterCounter(this.getValue().length);
        };
        MDCTextFieldFoundation.prototype.destroy = function () {
            var e_3, _a, e_4, _b;
            this.adapter.deregisterInputInteractionHandler('focus', this.inputFocusHandler);
            this.adapter.deregisterInputInteractionHandler('blur', this.inputBlurHandler);
            this.adapter.deregisterInputInteractionHandler('input', this.inputInputHandler);
            try {
                for (var POINTERDOWN_EVENTS_2 = __values(POINTERDOWN_EVENTS), POINTERDOWN_EVENTS_2_1 = POINTERDOWN_EVENTS_2.next(); !POINTERDOWN_EVENTS_2_1.done; POINTERDOWN_EVENTS_2_1 = POINTERDOWN_EVENTS_2.next()) {
                    var evtType = POINTERDOWN_EVENTS_2_1.value;
                    this.adapter.deregisterInputInteractionHandler(evtType, this.setPointerXOffset);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (POINTERDOWN_EVENTS_2_1 && !POINTERDOWN_EVENTS_2_1.done && (_a = POINTERDOWN_EVENTS_2.return)) _a.call(POINTERDOWN_EVENTS_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
            try {
                for (var INTERACTION_EVENTS_2 = __values(INTERACTION_EVENTS), INTERACTION_EVENTS_2_1 = INTERACTION_EVENTS_2.next(); !INTERACTION_EVENTS_2_1.done; INTERACTION_EVENTS_2_1 = INTERACTION_EVENTS_2.next()) {
                    var evtType = INTERACTION_EVENTS_2_1.value;
                    this.adapter.deregisterTextFieldInteractionHandler(evtType, this.textFieldInteractionHandler);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (INTERACTION_EVENTS_2_1 && !INTERACTION_EVENTS_2_1.done && (_b = INTERACTION_EVENTS_2.return)) _b.call(INTERACTION_EVENTS_2);
                }
                finally { if (e_4) throw e_4.error; }
            }
            this.adapter.deregisterValidationAttributeChangeHandler(this.validationObserver);
        };
        /**
         * Handles user interactions with the Text Field.
         */
        MDCTextFieldFoundation.prototype.handleTextFieldInteraction = function () {
            var nativeInput = this.adapter.getNativeInput();
            if (nativeInput && nativeInput.disabled) {
                return;
            }
            this.receivedUserInput = true;
        };
        /**
         * Handles validation attribute changes
         */
        MDCTextFieldFoundation.prototype.handleValidationAttributeChange = function (attributesList) {
            var _this = this;
            attributesList.some(function (attributeName) {
                if (VALIDATION_ATTR_WHITELIST.indexOf(attributeName) > -1) {
                    _this.styleValidity(true);
                    _this.adapter.setLabelRequired(_this.getNativeInput().required);
                    return true;
                }
                return false;
            });
            if (attributesList.indexOf('maxlength') > -1) {
                this.setcharacterCounter(this.getValue().length);
            }
        };
        /**
         * Opens/closes the notched outline.
         */
        MDCTextFieldFoundation.prototype.notchOutline = function (openNotch) {
            if (!this.adapter.hasOutline() || !this.adapter.hasLabel()) {
                return;
            }
            if (openNotch) {
                var labelWidth = this.adapter.getLabelWidth() * numbers$1.LABEL_SCALE;
                this.adapter.notchOutline(labelWidth);
            }
            else {
                this.adapter.closeOutline();
            }
        };
        /**
         * Activates the text field focus state.
         */
        MDCTextFieldFoundation.prototype.activateFocus = function () {
            this.isFocused = true;
            this.styleFocused(this.isFocused);
            this.adapter.activateLineRipple();
            if (this.adapter.hasLabel()) {
                this.notchOutline(this.shouldFloat);
                this.adapter.floatLabel(this.shouldFloat);
                this.styleFloating(this.shouldFloat);
                this.adapter.shakeLabel(this.shouldShake);
            }
            if (this.helperText &&
                (this.helperText.isPersistent() || !this.helperText.isValidation() ||
                    !this.valid)) {
                this.helperText.showToScreenReader();
            }
        };
        /**
         * Sets the line ripple's transform origin, so that the line ripple activate
         * animation will animate out from the user's click location.
         */
        MDCTextFieldFoundation.prototype.setTransformOrigin = function (evt) {
            if (this.isDisabled() || this.adapter.hasOutline()) {
                return;
            }
            var touches = evt.touches;
            var targetEvent = touches ? touches[0] : evt;
            var targetClientRect = targetEvent.target.getBoundingClientRect();
            var normalizedX = targetEvent.clientX - targetClientRect.left;
            this.adapter.setLineRippleTransformOrigin(normalizedX);
        };
        /**
         * Handles input change of text input and text area.
         */
        MDCTextFieldFoundation.prototype.handleInput = function () {
            this.autoCompleteFocus();
            this.setcharacterCounter(this.getValue().length);
        };
        /**
         * Activates the Text Field's focus state in cases when the input value
         * changes without user input (e.g. programmatically).
         */
        MDCTextFieldFoundation.prototype.autoCompleteFocus = function () {
            if (!this.receivedUserInput) {
                this.activateFocus();
            }
        };
        /**
         * Deactivates the Text Field's focus state.
         */
        MDCTextFieldFoundation.prototype.deactivateFocus = function () {
            this.isFocused = false;
            this.adapter.deactivateLineRipple();
            var isValid = this.isValid();
            this.styleValidity(isValid);
            this.styleFocused(this.isFocused);
            if (this.adapter.hasLabel()) {
                this.notchOutline(this.shouldFloat);
                this.adapter.floatLabel(this.shouldFloat);
                this.styleFloating(this.shouldFloat);
                this.adapter.shakeLabel(this.shouldShake);
            }
            if (!this.shouldFloat) {
                this.receivedUserInput = false;
            }
        };
        MDCTextFieldFoundation.prototype.getValue = function () {
            return this.getNativeInput().value;
        };
        /**
         * @param value The value to set on the input Element.
         */
        MDCTextFieldFoundation.prototype.setValue = function (value) {
            // Prevent Safari from moving the caret to the end of the input when the
            // value has not changed.
            if (this.getValue() !== value) {
                this.getNativeInput().value = value;
            }
            this.setcharacterCounter(value.length);
            if (this.validateOnValueChange) {
                var isValid = this.isValid();
                this.styleValidity(isValid);
            }
            if (this.adapter.hasLabel()) {
                this.notchOutline(this.shouldFloat);
                this.adapter.floatLabel(this.shouldFloat);
                this.styleFloating(this.shouldFloat);
                if (this.validateOnValueChange) {
                    this.adapter.shakeLabel(this.shouldShake);
                }
            }
        };
        /**
         * @return The custom validity state, if set; otherwise, the result of a
         *     native validity check.
         */
        MDCTextFieldFoundation.prototype.isValid = function () {
            return this.useNativeValidation ? this.isNativeInputValid() : this.valid;
        };
        /**
         * @param isValid Sets the custom validity state of the Text Field.
         */
        MDCTextFieldFoundation.prototype.setValid = function (isValid) {
            this.valid = isValid;
            this.styleValidity(isValid);
            var shouldShake = !isValid && !this.isFocused && !!this.getValue();
            if (this.adapter.hasLabel()) {
                this.adapter.shakeLabel(shouldShake);
            }
        };
        /**
         * @param shouldValidate Whether or not validity should be updated on
         *     value change.
         */
        MDCTextFieldFoundation.prototype.setValidateOnValueChange = function (shouldValidate) {
            this.validateOnValueChange = shouldValidate;
        };
        /**
         * @return Whether or not validity should be updated on value change. `true`
         *     by default.
         */
        MDCTextFieldFoundation.prototype.getValidateOnValueChange = function () {
            return this.validateOnValueChange;
        };
        /**
         * Enables or disables the use of native validation. Use this for custom
         * validation.
         * @param useNativeValidation Set this to false to ignore native input
         *     validation.
         */
        MDCTextFieldFoundation.prototype.setUseNativeValidation = function (useNativeValidation) {
            this.useNativeValidation = useNativeValidation;
        };
        MDCTextFieldFoundation.prototype.isDisabled = function () {
            return this.getNativeInput().disabled;
        };
        /**
         * @param disabled Sets the text-field disabled or enabled.
         */
        MDCTextFieldFoundation.prototype.setDisabled = function (disabled) {
            this.getNativeInput().disabled = disabled;
            this.styleDisabled(disabled);
        };
        /**
         * @param content Sets the content of the helper text.
         */
        MDCTextFieldFoundation.prototype.setHelperTextContent = function (content) {
            if (this.helperText) {
                this.helperText.setContent(content);
            }
        };
        /**
         * Sets the aria label of the leading icon.
         */
        MDCTextFieldFoundation.prototype.setLeadingIconAriaLabel = function (label) {
            if (this.leadingIcon) {
                this.leadingIcon.setAriaLabel(label);
            }
        };
        /**
         * Sets the text content of the leading icon.
         */
        MDCTextFieldFoundation.prototype.setLeadingIconContent = function (content) {
            if (this.leadingIcon) {
                this.leadingIcon.setContent(content);
            }
        };
        /**
         * Sets the aria label of the trailing icon.
         */
        MDCTextFieldFoundation.prototype.setTrailingIconAriaLabel = function (label) {
            if (this.trailingIcon) {
                this.trailingIcon.setAriaLabel(label);
            }
        };
        /**
         * Sets the text content of the trailing icon.
         */
        MDCTextFieldFoundation.prototype.setTrailingIconContent = function (content) {
            if (this.trailingIcon) {
                this.trailingIcon.setContent(content);
            }
        };
        /**
         * Sets character counter values that shows characters used and the total
         * character limit.
         */
        MDCTextFieldFoundation.prototype.setcharacterCounter = function (currentLength) {
            if (!this.characterCounter) {
                return;
            }
            var maxLength = this.getNativeInput().maxLength;
            if (maxLength === -1) {
                throw new Error('MDCTextFieldFoundation: Expected maxlength html property on text input or textarea.');
            }
            this.characterCounter.setCounterValue(currentLength, maxLength);
        };
        /**
         * @return True if the Text Field input fails in converting the user-supplied
         *     value.
         */
        MDCTextFieldFoundation.prototype.isBadInput = function () {
            // The badInput property is not supported in IE 11 💩.
            return this.getNativeInput().validity.badInput || false;
        };
        /**
         * @return The result of native validity checking (ValidityState.valid).
         */
        MDCTextFieldFoundation.prototype.isNativeInputValid = function () {
            return this.getNativeInput().validity.valid;
        };
        /**
         * Styles the component based on the validity state.
         */
        MDCTextFieldFoundation.prototype.styleValidity = function (isValid) {
            var INVALID = MDCTextFieldFoundation.cssClasses.INVALID;
            if (isValid) {
                this.adapter.removeClass(INVALID);
            }
            else {
                this.adapter.addClass(INVALID);
            }
            if (this.helperText) {
                this.helperText.setValidity(isValid);
                // We dynamically set or unset aria-describedby for validation helper text
                // only, based on whether the field is valid
                var helperTextValidation = this.helperText.isValidation();
                if (!helperTextValidation) {
                    return;
                }
                var helperTextVisible = this.helperText.isVisible();
                var helperTextId = this.helperText.getId();
                if (helperTextVisible && helperTextId) {
                    this.adapter.setInputAttr(strings$2.ARIA_DESCRIBEDBY, helperTextId);
                }
                else {
                    this.adapter.removeInputAttr(strings$2.ARIA_DESCRIBEDBY);
                }
            }
        };
        /**
         * Styles the component based on the focused state.
         */
        MDCTextFieldFoundation.prototype.styleFocused = function (isFocused) {
            var FOCUSED = MDCTextFieldFoundation.cssClasses.FOCUSED;
            if (isFocused) {
                this.adapter.addClass(FOCUSED);
            }
            else {
                this.adapter.removeClass(FOCUSED);
            }
        };
        /**
         * Styles the component based on the disabled state.
         */
        MDCTextFieldFoundation.prototype.styleDisabled = function (isDisabled) {
            var _a = MDCTextFieldFoundation.cssClasses, DISABLED = _a.DISABLED, INVALID = _a.INVALID;
            if (isDisabled) {
                this.adapter.addClass(DISABLED);
                this.adapter.removeClass(INVALID);
            }
            else {
                this.adapter.removeClass(DISABLED);
            }
            if (this.leadingIcon) {
                this.leadingIcon.setDisabled(isDisabled);
            }
            if (this.trailingIcon) {
                this.trailingIcon.setDisabled(isDisabled);
            }
        };
        /**
         * Styles the component based on the label floating state.
         */
        MDCTextFieldFoundation.prototype.styleFloating = function (isFloating) {
            var LABEL_FLOATING = MDCTextFieldFoundation.cssClasses.LABEL_FLOATING;
            if (isFloating) {
                this.adapter.addClass(LABEL_FLOATING);
            }
            else {
                this.adapter.removeClass(LABEL_FLOATING);
            }
        };
        /**
         * @return The native text input element from the host environment, or an
         *     object with the same shape for unit tests.
         */
        MDCTextFieldFoundation.prototype.getNativeInput = function () {
            // this.adapter may be undefined in foundation unit tests. This happens when
            // testdouble is creating a mock object and invokes the
            // shouldShake/shouldFloat getters (which in turn call getValue(), which
            // calls this method) before init() has been called from the MDCTextField
            // constructor. To work around that issue, we return a dummy object.
            var nativeInput = this.adapter ? this.adapter.getNativeInput() : null;
            return nativeInput || {
                disabled: false,
                maxLength: -1,
                required: false,
                type: 'input',
                validity: {
                    badInput: false,
                    valid: true,
                },
                value: '',
            };
        };
        return MDCTextFieldFoundation;
    }(MDCFoundation));

    function classMap(classObj) {
        return Object.entries(classObj)
            .filter(([name, value]) => name !== '' && value)
            .map(([name]) => name)
            .join(' ');
    }

    function dispatch(element, eventType, detail, eventInit = { bubbles: true }, 
    /** This is an internal thing used by SMUI to duplicate some SMUI events as MDC events. */
    duplicateEventForMDC = false) {
        if (typeof Event !== 'undefined' && element) {
            const event = new CustomEvent(eventType, Object.assign(Object.assign({}, eventInit), { detail }));
            element === null || element === void 0 ? void 0 : element.dispatchEvent(event);
            if (duplicateEventForMDC && eventType.startsWith('SMUI')) {
                const duplicateEvent = new CustomEvent(eventType.replace(/^SMUI/g, () => 'MDC'), Object.assign(Object.assign({}, eventInit), { detail }));
                element === null || element === void 0 ? void 0 : element.dispatchEvent(duplicateEvent);
                if (duplicateEvent.defaultPrevented) {
                    event.preventDefault();
                }
            }
            return event;
        }
    }

    function exclude(obj, keys) {
        let names = Object.getOwnPropertyNames(obj);
        const newObj = {};
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const cashIndex = name.indexOf('$');
            if (cashIndex !== -1 &&
                keys.indexOf(name.substring(0, cashIndex + 1)) !== -1) {
                continue;
            }
            if (keys.indexOf(name) !== -1) {
                continue;
            }
            newObj[name] = obj[name];
        }
        return newObj;
    }

    // Match old modifiers. (only works on DOM events)
    const oldModifierRegex = /^[a-z]+(?::(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
    // Match new modifiers.
    const newModifierRegex = /^[^$]+(?:\$(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
    function forwardEventsBuilder(component) {
        // This is our pseudo $on function. It is defined on component mount.
        let $on;
        // This is a list of events bound before mount.
        let events = [];
        // And we override the $on function to forward all bound events.
        component.$on = (fullEventType, callback) => {
            let eventType = fullEventType;
            let destructor = () => { };
            if ($on) {
                // The event was bound programmatically.
                destructor = $on(eventType, callback);
            }
            else {
                // The event was bound before mount by Svelte.
                events.push([eventType, callback]);
            }
            const oldModifierMatch = eventType.match(oldModifierRegex);
            if (oldModifierMatch && console) {
                console.warn('Event modifiers in SMUI now use "$" instead of ":", so that ' +
                    'all events can be bound with modifiers. Please update your ' +
                    'event binding: ', eventType);
            }
            return () => {
                destructor();
            };
        };
        function forward(e) {
            // Internally bubble the event up from Svelte components.
            bubble(component, e);
        }
        return (node) => {
            const destructors = [];
            const forwardDestructors = {};
            // This function is responsible for listening and forwarding
            // all bound events.
            $on = (fullEventType, callback) => {
                let eventType = fullEventType;
                let handler = callback;
                // DOM addEventListener options argument.
                let options = false;
                const oldModifierMatch = eventType.match(oldModifierRegex);
                const newModifierMatch = eventType.match(newModifierRegex);
                const modifierMatch = oldModifierMatch || newModifierMatch;
                if (eventType.match(/^SMUI:\w+:/)) {
                    const newEventTypeParts = eventType.split(':');
                    let newEventType = '';
                    for (let i = 0; i < newEventTypeParts.length; i++) {
                        newEventType +=
                            i === newEventTypeParts.length - 1
                                ? ':' + newEventTypeParts[i]
                                : newEventTypeParts[i]
                                    .split('-')
                                    .map((value) => value.slice(0, 1).toUpperCase() + value.slice(1))
                                    .join('');
                    }
                    console.warn(`The event ${eventType.split('$')[0]} has been renamed to ${newEventType.split('$')[0]}.`);
                    eventType = newEventType;
                }
                if (modifierMatch) {
                    // Parse the event modifiers.
                    // Supported modifiers:
                    // - preventDefault
                    // - stopPropagation
                    // - passive
                    // - nonpassive
                    // - capture
                    // - once
                    const parts = eventType.split(oldModifierMatch ? ':' : '$');
                    eventType = parts[0];
                    const eventOptions = Object.fromEntries(parts.slice(1).map((mod) => [mod, true]));
                    if (eventOptions.passive) {
                        options = options || {};
                        options.passive = true;
                    }
                    if (eventOptions.nonpassive) {
                        options = options || {};
                        options.passive = false;
                    }
                    if (eventOptions.capture) {
                        options = options || {};
                        options.capture = true;
                    }
                    if (eventOptions.once) {
                        options = options || {};
                        options.once = true;
                    }
                    if (eventOptions.preventDefault) {
                        handler = prevent_default(handler);
                    }
                    if (eventOptions.stopPropagation) {
                        handler = stop_propagation(handler);
                    }
                }
                // Listen for the event directly, with the given options.
                const off = listen(node, eventType, handler, options);
                const destructor = () => {
                    off();
                    const idx = destructors.indexOf(destructor);
                    if (idx > -1) {
                        destructors.splice(idx, 1);
                    }
                };
                destructors.push(destructor);
                // Forward the event from Svelte.
                if (!(eventType in forwardDestructors)) {
                    forwardDestructors[eventType] = listen(node, eventType, forward);
                }
                return destructor;
            };
            for (let i = 0; i < events.length; i++) {
                // Listen to all the events added before mount.
                $on(events[i][0], events[i][1]);
            }
            return {
                destroy: () => {
                    // Remove all event listeners.
                    for (let i = 0; i < destructors.length; i++) {
                        destructors[i]();
                    }
                    // Remove all event forwarders.
                    for (let entry of Object.entries(forwardDestructors)) {
                        entry[1]();
                    }
                },
            };
        };
    }

    function prefixFilter(obj, prefix) {
        let names = Object.getOwnPropertyNames(obj);
        const newObj = {};
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            if (name.substring(0, prefix.length) === prefix) {
                newObj[name.substring(prefix.length)] = obj[name];
            }
        }
        return newObj;
    }

    function useActions(node, actions) {
        let actionReturns = [];
        if (actions) {
            for (let i = 0; i < actions.length; i++) {
                const actionEntry = actions[i];
                const action = Array.isArray(actionEntry) ? actionEntry[0] : actionEntry;
                if (Array.isArray(actionEntry) && actionEntry.length > 1) {
                    actionReturns.push(action(node, actionEntry[1]));
                }
                else {
                    actionReturns.push(action(node));
                }
            }
        }
        return {
            update(actions) {
                if (((actions && actions.length) || 0) != actionReturns.length) {
                    throw new Error('You must not change the length of an actions array.');
                }
                if (actions) {
                    for (let i = 0; i < actions.length; i++) {
                        const returnEntry = actionReturns[i];
                        if (returnEntry && returnEntry.update) {
                            const actionEntry = actions[i];
                            if (Array.isArray(actionEntry) && actionEntry.length > 1) {
                                returnEntry.update(actionEntry[1]);
                            }
                            else {
                                returnEntry.update();
                            }
                        }
                    }
                }
            },
            destroy() {
                for (let i = 0; i < actionReturns.length; i++) {
                    const returnEntry = actionReturns[i];
                    if (returnEntry && returnEntry.destroy) {
                        returnEntry.destroy();
                    }
                }
            },
        };
    }

    /* node_modules/@smui/common/dist/elements/Span.svelte generated by Svelte v3.46.4 */
    const file$k = "node_modules/@smui/common/dist/elements/Span.svelte";

    function create_fragment$o(ctx) {
    	let span;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let span_levels = [/*$$restProps*/ ctx[3]];
    	let span_data = {};

    	for (let i = 0; i < span_levels.length; i += 1) {
    		span_data = assign(span_data, span_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			set_attributes(span, span_data);
    			add_location(span, file$k, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			/*span_binding*/ ctx[7](span);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, span, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[2].call(null, span))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(span, span_data = get_spread_update(span_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    			/*span_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Span', slots, ['default']);
    	let { use = [] } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element;

    	function getElement() {
    		return element;
    	}

    	function span_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		use,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		span_binding
    	];
    }

    class Span$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$o, safe_not_equal, { use: 0, getElement: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Span",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get use() {
    		throw new Error("<Span>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Span>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[4];
    	}

    	set getElement(value) {
    		throw new Error("<Span>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/common/dist/CommonLabel.svelte generated by Svelte v3.46.4 */

    // (1:0) <svelte:component   this={component}   bind:this={element}   use={[forwardEvents, ...use]}   class={classMap({     [className]: true,     'mdc-button__label': context === 'button',     'mdc-fab__label': context === 'fab',     'mdc-tab__text-label': context === 'tab',     'mdc-image-list__label': context === 'image-list',     'mdc-snackbar__label': context === 'snackbar',     'mdc-banner__text': context === 'banner',     'mdc-segmented-button__label': context === 'segmented-button',     'mdc-data-table__pagination-rows-per-page-label':       context === 'data-table:pagination',     'mdc-data-table__header-cell-label':       context === 'data-table:sortable-header-cell',   })}   {...context === 'snackbar' ? { 'aria-atomic': 'false' } : {}}   {tabindex}   {...$$restProps}>
    function create_default_slot$8(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(1:0) <svelte:component   this={component}   bind:this={element}   use={[forwardEvents, ...use]}   class={classMap({     [className]: true,     'mdc-button__label': context === 'button',     'mdc-fab__label': context === 'fab',     'mdc-tab__text-label': context === 'tab',     'mdc-image-list__label': context === 'image-list',     'mdc-snackbar__label': context === 'snackbar',     'mdc-banner__text': context === 'banner',     'mdc-segmented-button__label': context === 'segmented-button',     'mdc-data-table__pagination-rows-per-page-label':       context === 'data-table:pagination',     'mdc-data-table__header-cell-label':       context === 'data-table:sortable-header-cell',   })}   {...context === 'snackbar' ? { 'aria-atomic': 'false' } : {}}   {tabindex}   {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{
    			use: [/*forwardEvents*/ ctx[4], .../*use*/ ctx[0]]
    		},
    		{
    			class: classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-button__label': /*context*/ ctx[5] === 'button',
    				'mdc-fab__label': /*context*/ ctx[5] === 'fab',
    				'mdc-tab__text-label': /*context*/ ctx[5] === 'tab',
    				'mdc-image-list__label': /*context*/ ctx[5] === 'image-list',
    				'mdc-snackbar__label': /*context*/ ctx[5] === 'snackbar',
    				'mdc-banner__text': /*context*/ ctx[5] === 'banner',
    				'mdc-segmented-button__label': /*context*/ ctx[5] === 'segmented-button',
    				'mdc-data-table__pagination-rows-per-page-label': /*context*/ ctx[5] === 'data-table:pagination',
    				'mdc-data-table__header-cell-label': /*context*/ ctx[5] === 'data-table:sortable-header-cell'
    			})
    		},
    		/*context*/ ctx[5] === 'snackbar'
    		? { 'aria-atomic': 'false' }
    		: {},
    		{ tabindex: /*tabindex*/ ctx[6] },
    		/*$$restProps*/ ctx[7]
    	];

    	var switch_value = /*component*/ ctx[2];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot$8] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		/*switch_instance_binding*/ ctx[10](switch_instance);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = (dirty & /*forwardEvents, use, classMap, className, context, tabindex, $$restProps*/ 243)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*forwardEvents, use*/ 17 && {
    						use: [/*forwardEvents*/ ctx[4], .../*use*/ ctx[0]]
    					},
    					dirty & /*classMap, className, context*/ 34 && {
    						class: classMap({
    							[/*className*/ ctx[1]]: true,
    							'mdc-button__label': /*context*/ ctx[5] === 'button',
    							'mdc-fab__label': /*context*/ ctx[5] === 'fab',
    							'mdc-tab__text-label': /*context*/ ctx[5] === 'tab',
    							'mdc-image-list__label': /*context*/ ctx[5] === 'image-list',
    							'mdc-snackbar__label': /*context*/ ctx[5] === 'snackbar',
    							'mdc-banner__text': /*context*/ ctx[5] === 'banner',
    							'mdc-segmented-button__label': /*context*/ ctx[5] === 'segmented-button',
    							'mdc-data-table__pagination-rows-per-page-label': /*context*/ ctx[5] === 'data-table:pagination',
    							'mdc-data-table__header-cell-label': /*context*/ ctx[5] === 'data-table:sortable-header-cell'
    						})
    					},
    					dirty & /*context*/ 32 && get_spread_object(/*context*/ ctx[5] === 'snackbar'
    					? { 'aria-atomic': 'false' }
    					: {}),
    					dirty & /*tabindex*/ 64 && { tabindex: /*tabindex*/ ctx[6] },
    					dirty & /*$$restProps*/ 128 && get_spread_object(/*$$restProps*/ ctx[7])
    				])
    			: {};

    			if (dirty & /*$$scope*/ 2048) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*component*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					/*switch_instance_binding*/ ctx[10](switch_instance);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*switch_instance_binding*/ ctx[10](null);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","component","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CommonLabel', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let element;
    	let { component = Span$1 } = $$props;
    	const context = getContext('SMUI:label:context');
    	const tabindex = getContext('SMUI:label:tabindex');

    	function getElement() {
    		return element.getElement();
    	}

    	function switch_instance_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(3, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('component' in $$new_props) $$invalidate(2, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		Span: Span$1,
    		forwardEvents,
    		use,
    		className,
    		element,
    		component,
    		context,
    		tabindex,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(3, element = $$new_props.element);
    		if ('component' in $$props) $$invalidate(2, component = $$new_props.component);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		component,
    		element,
    		forwardEvents,
    		context,
    		tabindex,
    		$$restProps,
    		getElement,
    		slots,
    		switch_instance_binding,
    		$$scope
    	];
    }

    class CommonLabel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$n, safe_not_equal, {
    			use: 0,
    			class: 1,
    			component: 2,
    			getElement: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CommonLabel",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get use() {
    		throw new Error("<CommonLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<CommonLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<CommonLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CommonLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<CommonLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<CommonLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[8];
    	}

    	set getElement(value) {
    		throw new Error("<CommonLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/common/dist/ContextFragment.svelte generated by Svelte v3.46.4 */

    function create_fragment$m(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $storeValue;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ContextFragment', slots, ['default']);
    	let { key } = $$props;
    	let { value } = $$props;
    	const storeValue = writable(value);
    	validate_store(storeValue, 'storeValue');
    	component_subscribe($$self, storeValue, value => $$invalidate(5, $storeValue = value));
    	setContext(key, storeValue);

    	onDestroy(() => {
    		storeValue.set(undefined);
    	});

    	const writable_props = ['key', 'value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ContextFragment> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('key' in $$props) $$invalidate(1, key = $$props.key);
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		setContext,
    		writable,
    		key,
    		value,
    		storeValue,
    		$storeValue
    	});

    	$$self.$inject_state = $$props => {
    		if ('key' in $$props) $$invalidate(1, key = $$props.key);
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 4) {
    			set_store_value(storeValue, $storeValue = value, $storeValue);
    		}
    	};

    	return [storeValue, key, value, $$scope, slots];
    }

    class ContextFragment extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$m, safe_not_equal, { key: 1, value: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContextFragment",
    			options,
    			id: create_fragment$m.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*key*/ ctx[1] === undefined && !('key' in props)) {
    			console.warn("<ContextFragment> was created without expected prop 'key'");
    		}

    		if (/*value*/ ctx[2] === undefined && !('value' in props)) {
    			console.warn("<ContextFragment> was created without expected prop 'value'");
    		}
    	}

    	get key() {
    		throw new Error("<ContextFragment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<ContextFragment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<ContextFragment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ContextFragment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const Label = CommonLabel;

    const { applyPassive } = events;
    const { matches } = ponyfill;
    function Ripple(node, { ripple = true, surface = false, unbounded = false, disabled = false, color, active, rippleElement, eventTarget, activeTarget, addClass = (className) => node.classList.add(className), removeClass = (className) => node.classList.remove(className), addStyle = (name, value) => node.style.setProperty(name, value), initPromise = Promise.resolve(), } = {}) {
        let instance;
        let addLayoutListener = getContext('SMUI:addLayoutListener');
        let removeLayoutListener;
        let oldActive = active;
        let oldEventTarget = eventTarget;
        let oldActiveTarget = activeTarget;
        function handleProps() {
            if (surface) {
                addClass('mdc-ripple-surface');
                if (color === 'primary') {
                    addClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
                else if (color === 'secondary') {
                    removeClass('smui-ripple-surface--primary');
                    addClass('smui-ripple-surface--secondary');
                }
                else {
                    removeClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
            }
            else {
                removeClass('mdc-ripple-surface');
                removeClass('smui-ripple-surface--primary');
                removeClass('smui-ripple-surface--secondary');
            }
            // Handle activation first.
            if (instance && oldActive !== active) {
                oldActive = active;
                if (active) {
                    instance.activate();
                }
                else if (active === false) {
                    instance.deactivate();
                }
            }
            // Then create/destroy an instance.
            if (ripple && !instance) {
                instance = new MDCRippleFoundation({
                    addClass,
                    browserSupportsCssVars: () => supportsCssVariables(window),
                    computeBoundingRect: () => (rippleElement || node).getBoundingClientRect(),
                    containsEventTarget: (target) => node.contains(target),
                    deregisterDocumentInteractionHandler: (evtType, handler) => document.documentElement.removeEventListener(evtType, handler, applyPassive()),
                    deregisterInteractionHandler: (evtType, handler) => (eventTarget || node).removeEventListener(evtType, handler, applyPassive()),
                    deregisterResizeHandler: (handler) => window.removeEventListener('resize', handler),
                    getWindowPageOffset: () => ({
                        x: window.pageXOffset,
                        y: window.pageYOffset,
                    }),
                    isSurfaceActive: () => active == null ? matches(activeTarget || node, ':active') : active,
                    isSurfaceDisabled: () => !!disabled,
                    isUnbounded: () => !!unbounded,
                    registerDocumentInteractionHandler: (evtType, handler) => document.documentElement.addEventListener(evtType, handler, applyPassive()),
                    registerInteractionHandler: (evtType, handler) => (eventTarget || node).addEventListener(evtType, handler, applyPassive()),
                    registerResizeHandler: (handler) => window.addEventListener('resize', handler),
                    removeClass,
                    updateCssVariable: addStyle,
                });
                initPromise.then(() => {
                    if (instance) {
                        instance.init();
                        instance.setUnbounded(unbounded);
                    }
                });
            }
            else if (instance && !ripple) {
                initPromise.then(() => {
                    if (instance) {
                        instance.destroy();
                        instance = undefined;
                    }
                });
            }
            // Now handle event/active targets
            if (instance &&
                (oldEventTarget !== eventTarget || oldActiveTarget !== activeTarget)) {
                oldEventTarget = eventTarget;
                oldActiveTarget = activeTarget;
                instance.destroy();
                requestAnimationFrame(() => {
                    if (instance) {
                        instance.init();
                        instance.setUnbounded(unbounded);
                    }
                });
            }
            if (!ripple && unbounded) {
                addClass('mdc-ripple-upgraded--unbounded');
            }
        }
        handleProps();
        if (addLayoutListener) {
            removeLayoutListener = addLayoutListener(layout);
        }
        function layout() {
            if (instance) {
                instance.layout();
            }
        }
        return {
            update(props) {
                ({
                    ripple,
                    surface,
                    unbounded,
                    disabled,
                    color,
                    active,
                    rippleElement,
                    eventTarget,
                    activeTarget,
                    addClass,
                    removeClass,
                    addStyle,
                    initPromise,
                } = Object.assign({ ripple: true, surface: false, unbounded: false, disabled: false, color: undefined, active: undefined, rippleElement: undefined, eventTarget: undefined, activeTarget: undefined, addClass: (className) => node.classList.add(className), removeClass: (className) => node.classList.remove(className), addStyle: (name, value) => node.style.setProperty(name, value), initPromise: Promise.resolve() }, props));
                handleProps();
            },
            destroy() {
                if (instance) {
                    instance.destroy();
                    instance = undefined;
                    removeClass('mdc-ripple-surface');
                    removeClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
                if (removeLayoutListener) {
                    removeLayoutListener();
                }
            },
        };
    }

    /* node_modules/@smui/floating-label/dist/FloatingLabel.svelte generated by Svelte v3.46.4 */

    const file$j = "node_modules/@smui/floating-label/dist/FloatingLabel.svelte";

    // (19:0) {:else}
    function create_else_block$2(ctx) {
    	let label;
    	let label_class_value;
    	let label_style_value;
    	let label_for_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[22].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], null);

    	let label_levels = [
    		{
    			class: label_class_value = classMap({
    				[/*className*/ ctx[3]]: true,
    				'mdc-floating-label': true,
    				'mdc-floating-label--float-above': /*floatAbove*/ ctx[0],
    				'mdc-floating-label--required': /*required*/ ctx[1],
    				.../*internalClasses*/ ctx[8]
    			})
    		},
    		{
    			style: label_style_value = Object.entries(/*internalStyles*/ ctx[9]).map(func_1$1).concat([/*style*/ ctx[4]]).join(' ')
    		},
    		{
    			for: label_for_value = /*forId*/ ctx[5] || (/*inputProps*/ ctx[11]
    			? /*inputProps*/ ctx[11].id
    			: undefined)
    		},
    		/*$$restProps*/ ctx[12]
    	];

    	let label_data = {};

    	for (let i = 0; i < label_levels.length; i += 1) {
    		label_data = assign(label_data, label_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			label = element("label");
    			if (default_slot) default_slot.c();
    			set_attributes(label, label_data);
    			add_location(label, file$j, 19, 2, 494);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);

    			if (default_slot) {
    				default_slot.m(label, null);
    			}

    			/*label_binding*/ ctx[24](label);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, label, /*use*/ ctx[2])),
    					action_destroyer(/*forwardEvents*/ ctx[10].call(null, label))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2097152)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[21],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[21])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[21], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(label, label_data = get_spread_update(label_levels, [
    				(!current || dirty & /*className, floatAbove, required, internalClasses*/ 267 && label_class_value !== (label_class_value = classMap({
    					[/*className*/ ctx[3]]: true,
    					'mdc-floating-label': true,
    					'mdc-floating-label--float-above': /*floatAbove*/ ctx[0],
    					'mdc-floating-label--required': /*required*/ ctx[1],
    					.../*internalClasses*/ ctx[8]
    				}))) && { class: label_class_value },
    				(!current || dirty & /*internalStyles, style*/ 528 && label_style_value !== (label_style_value = Object.entries(/*internalStyles*/ ctx[9]).map(func_1$1).concat([/*style*/ ctx[4]]).join(' '))) && { style: label_style_value },
    				(!current || dirty & /*forId*/ 32 && label_for_value !== (label_for_value = /*forId*/ ctx[5] || (/*inputProps*/ ctx[11]
    				? /*inputProps*/ ctx[11].id
    				: undefined))) && { for: label_for_value },
    				dirty & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 4) useActions_action.update.call(null, /*use*/ ctx[2]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (default_slot) default_slot.d(detaching);
    			/*label_binding*/ ctx[24](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(19:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (1:0) {#if wrapped}
    function create_if_block$7(ctx) {
    	let span;
    	let span_class_value;
    	let span_style_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[22].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], null);

    	let span_levels = [
    		{
    			class: span_class_value = classMap({
    				[/*className*/ ctx[3]]: true,
    				'mdc-floating-label': true,
    				'mdc-floating-label--float-above': /*floatAbove*/ ctx[0],
    				'mdc-floating-label--required': /*required*/ ctx[1],
    				.../*internalClasses*/ ctx[8]
    			})
    		},
    		{
    			style: span_style_value = Object.entries(/*internalStyles*/ ctx[9]).map(func$7).concat([/*style*/ ctx[4]]).join(' ')
    		},
    		/*$$restProps*/ ctx[12]
    	];

    	let span_data = {};

    	for (let i = 0; i < span_levels.length; i += 1) {
    		span_data = assign(span_data, span_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			set_attributes(span, span_data);
    			add_location(span, file$j, 1, 2, 16);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			/*span_binding*/ ctx[23](span);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, span, /*use*/ ctx[2])),
    					action_destroyer(/*forwardEvents*/ ctx[10].call(null, span))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2097152)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[21],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[21])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[21], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(span, span_data = get_spread_update(span_levels, [
    				(!current || dirty & /*className, floatAbove, required, internalClasses*/ 267 && span_class_value !== (span_class_value = classMap({
    					[/*className*/ ctx[3]]: true,
    					'mdc-floating-label': true,
    					'mdc-floating-label--float-above': /*floatAbove*/ ctx[0],
    					'mdc-floating-label--required': /*required*/ ctx[1],
    					.../*internalClasses*/ ctx[8]
    				}))) && { class: span_class_value },
    				(!current || dirty & /*internalStyles, style*/ 528 && span_style_value !== (span_style_value = Object.entries(/*internalStyles*/ ctx[9]).map(func$7).concat([/*style*/ ctx[4]]).join(' '))) && { style: span_style_value },
    				dirty & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 4) useActions_action.update.call(null, /*use*/ ctx[2]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    			/*span_binding*/ ctx[23](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(1:0) {#if wrapped}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$7, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*wrapped*/ ctx[6]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$7 = ([name, value]) => `${name}: ${value};`;
    const func_1$1 = ([name, value]) => `${name}: ${value};`;

    function instance_1$7($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","style","for","floatAbove","required","wrapped","shake","float","setRequired","getWidth","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FloatingLabel', slots, ['default']);
    	var _a;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
    	let { for: forId = undefined } = $$props;
    	let { floatAbove = false } = $$props;
    	let { required = false } = $$props;
    	let { wrapped = false } = $$props;
    	let element;
    	let instance;
    	let internalClasses = {};
    	let internalStyles = {};

    	let inputProps = (_a = getContext('SMUI:generic:input:props')) !== null && _a !== void 0
    	? _a
    	: {};

    	let previousFloatAbove = floatAbove;
    	let previousRequired = required;

    	onMount(() => {
    		$$invalidate(18, instance = new MDCFloatingLabelFoundation({
    				addClass,
    				removeClass,
    				getWidth: () => {
    					var _a, _b;
    					const el = getElement();
    					const clone = el.cloneNode(true);

    					(_a = el.parentNode) === null || _a === void 0
    					? void 0
    					: _a.appendChild(clone);

    					clone.classList.add('smui-floating-label--remove-transition');
    					clone.classList.add('smui-floating-label--force-size');
    					clone.classList.remove('mdc-floating-label--float-above');
    					const scrollWidth = clone.scrollWidth;

    					(_b = el.parentNode) === null || _b === void 0
    					? void 0
    					: _b.removeChild(clone);

    					return scrollWidth;
    				},
    				registerInteractionHandler: (evtType, handler) => getElement().addEventListener(evtType, handler),
    				deregisterInteractionHandler: (evtType, handler) => getElement().removeEventListener(evtType, handler)
    			}));

    		const accessor = {
    			get element() {
    				return getElement();
    			},
    			addStyle,
    			removeStyle
    		};

    		dispatch(element, 'SMUIFloatingLabel:mount', accessor);
    		instance.init();

    		return () => {
    			dispatch(element, 'SMUIFloatingLabel:unmount', accessor);
    			instance.destroy();
    		};
    	});

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(8, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(8, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addStyle(name, value) {
    		if (internalStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete internalStyles[name];
    				$$invalidate(9, internalStyles);
    			} else {
    				$$invalidate(9, internalStyles[name] = value, internalStyles);
    			}
    		}
    	}

    	function removeStyle(name) {
    		if (name in internalStyles) {
    			delete internalStyles[name];
    			$$invalidate(9, internalStyles);
    		}
    	}

    	function shake(shouldShake) {
    		instance.shake(shouldShake);
    	}

    	function float(shouldFloat) {
    		$$invalidate(0, floatAbove = shouldFloat);
    	}

    	function setRequired(isRequired) {
    		$$invalidate(1, required = isRequired);
    	}

    	function getWidth() {
    		return instance.getWidth();
    	}

    	function getElement() {
    		return element;
    	}

    	function span_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(7, element);
    		});
    	}

    	function label_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(7, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(2, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(4, style = $$new_props.style);
    		if ('for' in $$new_props) $$invalidate(5, forId = $$new_props.for);
    		if ('floatAbove' in $$new_props) $$invalidate(0, floatAbove = $$new_props.floatAbove);
    		if ('required' in $$new_props) $$invalidate(1, required = $$new_props.required);
    		if ('wrapped' in $$new_props) $$invalidate(6, wrapped = $$new_props.wrapped);
    		if ('$$scope' in $$new_props) $$invalidate(21, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		_a,
    		MDCFloatingLabelFoundation,
    		onMount,
    		getContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		dispatch,
    		forwardEvents,
    		use,
    		className,
    		style,
    		forId,
    		floatAbove,
    		required,
    		wrapped,
    		element,
    		instance,
    		internalClasses,
    		internalStyles,
    		inputProps,
    		previousFloatAbove,
    		previousRequired,
    		addClass,
    		removeClass,
    		addStyle,
    		removeStyle,
    		shake,
    		float,
    		setRequired,
    		getWidth,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('_a' in $$props) _a = $$new_props._a;
    		if ('use' in $$props) $$invalidate(2, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(3, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(4, style = $$new_props.style);
    		if ('forId' in $$props) $$invalidate(5, forId = $$new_props.forId);
    		if ('floatAbove' in $$props) $$invalidate(0, floatAbove = $$new_props.floatAbove);
    		if ('required' in $$props) $$invalidate(1, required = $$new_props.required);
    		if ('wrapped' in $$props) $$invalidate(6, wrapped = $$new_props.wrapped);
    		if ('element' in $$props) $$invalidate(7, element = $$new_props.element);
    		if ('instance' in $$props) $$invalidate(18, instance = $$new_props.instance);
    		if ('internalClasses' in $$props) $$invalidate(8, internalClasses = $$new_props.internalClasses);
    		if ('internalStyles' in $$props) $$invalidate(9, internalStyles = $$new_props.internalStyles);
    		if ('inputProps' in $$props) $$invalidate(11, inputProps = $$new_props.inputProps);
    		if ('previousFloatAbove' in $$props) $$invalidate(19, previousFloatAbove = $$new_props.previousFloatAbove);
    		if ('previousRequired' in $$props) $$invalidate(20, previousRequired = $$new_props.previousRequired);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*instance, previousFloatAbove, floatAbove*/ 786433) {
    			if (instance && previousFloatAbove !== floatAbove) {
    				$$invalidate(19, previousFloatAbove = floatAbove);
    				instance.float(floatAbove);
    			}
    		}

    		if ($$self.$$.dirty & /*instance, previousRequired, required*/ 1310722) {
    			if (instance && previousRequired !== required) {
    				$$invalidate(20, previousRequired = required);
    				instance.setRequired(required);
    			}
    		}
    	};

    	return [
    		floatAbove,
    		required,
    		use,
    		className,
    		style,
    		forId,
    		wrapped,
    		element,
    		internalClasses,
    		internalStyles,
    		forwardEvents,
    		inputProps,
    		$$restProps,
    		shake,
    		float,
    		setRequired,
    		getWidth,
    		getElement,
    		instance,
    		previousFloatAbove,
    		previousRequired,
    		$$scope,
    		slots,
    		span_binding,
    		label_binding
    	];
    }

    class FloatingLabel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance_1$7, create_fragment$l, safe_not_equal, {
    			use: 2,
    			class: 3,
    			style: 4,
    			for: 5,
    			floatAbove: 0,
    			required: 1,
    			wrapped: 6,
    			shake: 13,
    			float: 14,
    			setRequired: 15,
    			getWidth: 16,
    			getElement: 17
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FloatingLabel",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get use() {
    		throw new Error("<FloatingLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<FloatingLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<FloatingLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get for() {
    		throw new Error("<FloatingLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set for(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get floatAbove() {
    		throw new Error("<FloatingLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set floatAbove(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get required() {
    		throw new Error("<FloatingLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set required(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get wrapped() {
    		throw new Error("<FloatingLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wrapped(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shake() {
    		return this.$$.ctx[13];
    	}

    	set shake(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get float() {
    		return this.$$.ctx[14];
    	}

    	set float(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setRequired() {
    		return this.$$.ctx[15];
    	}

    	set setRequired(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getWidth() {
    		return this.$$.ctx[16];
    	}

    	set getWidth(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[17];
    	}

    	set getElement(value) {
    		throw new Error("<FloatingLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/line-ripple/dist/LineRipple.svelte generated by Svelte v3.46.4 */
    const file$i = "node_modules/@smui/line-ripple/dist/LineRipple.svelte";

    function create_fragment$k(ctx) {
    	let div;
    	let div_class_value;
    	let div_style_value;
    	let useActions_action;
    	let mounted;
    	let dispose;

    	let div_levels = [
    		{
    			class: div_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-line-ripple': true,
    				'mdc-line-ripple--active': /*active*/ ctx[3],
    				.../*internalClasses*/ ctx[5]
    			})
    		},
    		{
    			style: div_style_value = Object.entries(/*internalStyles*/ ctx[6]).map(func$6).concat([/*style*/ ctx[2]]).join(' ')
    		},
    		/*$$restProps*/ ctx[8]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			set_attributes(div, div_data);
    			add_location(div, file$i, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			/*div_binding*/ ctx[13](div);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[7].call(null, div))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*className, active, internalClasses*/ 42 && div_class_value !== (div_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-line-ripple': true,
    					'mdc-line-ripple--active': /*active*/ ctx[3],
    					.../*internalClasses*/ ctx[5]
    				})) && { class: div_class_value },
    				dirty & /*internalStyles, style*/ 68 && div_style_value !== (div_style_value = Object.entries(/*internalStyles*/ ctx[6]).map(func$6).concat([/*style*/ ctx[2]]).join(' ')) && { style: div_style_value },
    				dirty & /*$$restProps*/ 256 && /*$$restProps*/ ctx[8]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[13](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$6 = ([name, value]) => `${name}: ${value};`;

    function instance_1$6($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","style","active","activate","deactivate","setRippleCenter","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LineRipple', slots, []);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
    	let { active = false } = $$props;
    	let element;
    	let instance;
    	let internalClasses = {};
    	let internalStyles = {};

    	onMount(() => {
    		instance = new MDCLineRippleFoundation({
    				addClass,
    				removeClass,
    				hasClass,
    				setStyle: addStyle,
    				registerEventHandler: (evtType, handler) => getElement().addEventListener(evtType, handler),
    				deregisterEventHandler: (evtType, handler) => getElement().removeEventListener(evtType, handler)
    			});

    		instance.init();

    		return () => {
    			instance.destroy();
    		};
    	});

    	function hasClass(className) {
    		return className in internalClasses
    		? internalClasses[className]
    		: getElement().classList.contains(className);
    	}

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(5, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(5, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addStyle(name, value) {
    		if (internalStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete internalStyles[name];
    				$$invalidate(6, internalStyles);
    			} else {
    				$$invalidate(6, internalStyles[name] = value, internalStyles);
    			}
    		}
    	}

    	function activate() {
    		instance.activate();
    	}

    	function deactivate() {
    		instance.deactivate();
    	}

    	function setRippleCenter(xCoordinate) {
    		instance.setRippleCenter(xCoordinate);
    	}

    	function getElement() {
    		return element;
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(4, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(2, style = $$new_props.style);
    		if ('active' in $$new_props) $$invalidate(3, active = $$new_props.active);
    	};

    	$$self.$capture_state = () => ({
    		MDCLineRippleFoundation,
    		onMount,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		forwardEvents,
    		use,
    		className,
    		style,
    		active,
    		element,
    		instance,
    		internalClasses,
    		internalStyles,
    		hasClass,
    		addClass,
    		removeClass,
    		addStyle,
    		activate,
    		deactivate,
    		setRippleCenter,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(2, style = $$new_props.style);
    		if ('active' in $$props) $$invalidate(3, active = $$new_props.active);
    		if ('element' in $$props) $$invalidate(4, element = $$new_props.element);
    		if ('instance' in $$props) instance = $$new_props.instance;
    		if ('internalClasses' in $$props) $$invalidate(5, internalClasses = $$new_props.internalClasses);
    		if ('internalStyles' in $$props) $$invalidate(6, internalStyles = $$new_props.internalStyles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		style,
    		active,
    		element,
    		internalClasses,
    		internalStyles,
    		forwardEvents,
    		$$restProps,
    		activate,
    		deactivate,
    		setRippleCenter,
    		getElement,
    		div_binding
    	];
    }

    class LineRipple extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance_1$6, create_fragment$k, safe_not_equal, {
    			use: 0,
    			class: 1,
    			style: 2,
    			active: 3,
    			activate: 9,
    			deactivate: 10,
    			setRippleCenter: 11,
    			getElement: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LineRipple",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get use() {
    		throw new Error("<LineRipple>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<LineRipple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<LineRipple>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<LineRipple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<LineRipple>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<LineRipple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<LineRipple>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<LineRipple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activate() {
    		return this.$$.ctx[9];
    	}

    	set activate(value) {
    		throw new Error("<LineRipple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get deactivate() {
    		return this.$$.ctx[10];
    	}

    	set deactivate(value) {
    		throw new Error("<LineRipple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setRippleCenter() {
    		return this.$$.ctx[11];
    	}

    	set setRippleCenter(value) {
    		throw new Error("<LineRipple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[12];
    	}

    	set getElement(value) {
    		throw new Error("<LineRipple>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/notched-outline/dist/NotchedOutline.svelte generated by Svelte v3.46.4 */
    const file$h = "node_modules/@smui/notched-outline/dist/NotchedOutline.svelte";

    // (17:2) {#if !noLabel}
    function create_if_block$6(ctx) {
    	let div;
    	let div_style_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "mdc-notched-outline__notch");
    			attr_dev(div, "style", div_style_value = Object.entries(/*notchStyles*/ ctx[7]).map(func$5).join(' '));
    			add_location(div, file$h, 17, 4, 496);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*notchStyles*/ 128 && div_style_value !== (div_style_value = Object.entries(/*notchStyles*/ ctx[7]).map(func$5).join(' '))) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(17:2) {#if !noLabel}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let div2_class_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = !/*noLabel*/ ctx[3] && create_if_block$6(ctx);

    	let div2_levels = [
    		{
    			class: div2_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-notched-outline': true,
    				'mdc-notched-outline--notched': /*notched*/ ctx[2],
    				'mdc-notched-outline--no-label': /*noLabel*/ ctx[3],
    				.../*internalClasses*/ ctx[6]
    			})
    		},
    		/*$$restProps*/ ctx[9]
    	];

    	let div2_data = {};

    	for (let i = 0; i < div2_levels.length; i += 1) {
    		div2_data = assign(div2_data, div2_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "mdc-notched-outline__leading");
    			add_location(div0, file$h, 15, 2, 430);
    			attr_dev(div1, "class", "mdc-notched-outline__trailing");
    			add_location(div1, file$h, 26, 2, 699);
    			set_attributes(div2, div2_data);
    			add_location(div2, file$h, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			if (if_block) if_block.m(div2, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			/*div2_binding*/ ctx[15](div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div2, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[8].call(null, div2)),
    					listen_dev(div2, "SMUIFloatingLabel:mount", /*SMUIFloatingLabel_mount_handler*/ ctx[16], false, false, false),
    					listen_dev(div2, "SMUIFloatingLabel:unmount", /*SMUIFloatingLabel_unmount_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*noLabel*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*noLabel*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div2, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			set_attributes(div2, div2_data = get_spread_update(div2_levels, [
    				(!current || dirty & /*className, notched, noLabel, internalClasses*/ 78 && div2_class_value !== (div2_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-notched-outline': true,
    					'mdc-notched-outline--notched': /*notched*/ ctx[2],
    					'mdc-notched-outline--no-label': /*noLabel*/ ctx[3],
    					.../*internalClasses*/ ctx[6]
    				}))) && { class: div2_class_value },
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    			/*div2_binding*/ ctx[15](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$5 = ([name, value]) => `${name}: ${value};`;

    function instance_1$5($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","notched","noLabel","notch","closeNotch","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NotchedOutline', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { notched = false } = $$props;
    	let { noLabel = false } = $$props;
    	let element;
    	let instance;
    	let floatingLabel;
    	let internalClasses = {};
    	let notchStyles = {};

    	onMount(() => {
    		instance = new MDCNotchedOutlineFoundation({
    				addClass,
    				removeClass,
    				setNotchWidthProperty: width => addNotchStyle('width', width + 'px'),
    				removeNotchWidthProperty: () => removeNotchStyle('width')
    			});

    		instance.init();

    		return () => {
    			instance.destroy();
    		};
    	});

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(6, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(6, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addNotchStyle(name, value) {
    		if (notchStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete notchStyles[name];
    				$$invalidate(7, notchStyles);
    			} else {
    				$$invalidate(7, notchStyles[name] = value, notchStyles);
    			}
    		}
    	}

    	function removeNotchStyle(name) {
    		if (name in notchStyles) {
    			delete notchStyles[name];
    			$$invalidate(7, notchStyles);
    		}
    	}

    	function notch(notchWidth) {
    		instance.notch(notchWidth);
    	}

    	function closeNotch() {
    		instance.closeNotch();
    	}

    	function getElement() {
    		return element;
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(5, element);
    		});
    	}

    	const SMUIFloatingLabel_mount_handler = event => $$invalidate(4, floatingLabel = event.detail);
    	const SMUIFloatingLabel_unmount_handler = () => $$invalidate(4, floatingLabel = undefined);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('notched' in $$new_props) $$invalidate(2, notched = $$new_props.notched);
    		if ('noLabel' in $$new_props) $$invalidate(3, noLabel = $$new_props.noLabel);
    		if ('$$scope' in $$new_props) $$invalidate(13, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MDCNotchedOutlineFoundation,
    		onMount,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		forwardEvents,
    		use,
    		className,
    		notched,
    		noLabel,
    		element,
    		instance,
    		floatingLabel,
    		internalClasses,
    		notchStyles,
    		addClass,
    		removeClass,
    		addNotchStyle,
    		removeNotchStyle,
    		notch,
    		closeNotch,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('notched' in $$props) $$invalidate(2, notched = $$new_props.notched);
    		if ('noLabel' in $$props) $$invalidate(3, noLabel = $$new_props.noLabel);
    		if ('element' in $$props) $$invalidate(5, element = $$new_props.element);
    		if ('instance' in $$props) instance = $$new_props.instance;
    		if ('floatingLabel' in $$props) $$invalidate(4, floatingLabel = $$new_props.floatingLabel);
    		if ('internalClasses' in $$props) $$invalidate(6, internalClasses = $$new_props.internalClasses);
    		if ('notchStyles' in $$props) $$invalidate(7, notchStyles = $$new_props.notchStyles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*floatingLabel*/ 16) {
    			if (floatingLabel) {
    				floatingLabel.addStyle('transition-duration', '0s');
    				addClass('mdc-notched-outline--upgraded');

    				requestAnimationFrame(() => {
    					if (floatingLabel) {
    						floatingLabel.removeStyle('transition-duration');
    					}
    				});
    			} else {
    				removeClass('mdc-notched-outline--upgraded');
    			}
    		}
    	};

    	return [
    		use,
    		className,
    		notched,
    		noLabel,
    		floatingLabel,
    		element,
    		internalClasses,
    		notchStyles,
    		forwardEvents,
    		$$restProps,
    		notch,
    		closeNotch,
    		getElement,
    		$$scope,
    		slots,
    		div2_binding,
    		SMUIFloatingLabel_mount_handler,
    		SMUIFloatingLabel_unmount_handler
    	];
    }

    class NotchedOutline extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance_1$5, create_fragment$j, safe_not_equal, {
    			use: 0,
    			class: 1,
    			notched: 2,
    			noLabel: 3,
    			notch: 10,
    			closeNotch: 11,
    			getElement: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotchedOutline",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get use() {
    		throw new Error("<NotchedOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<NotchedOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<NotchedOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NotchedOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get notched() {
    		throw new Error("<NotchedOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set notched(value) {
    		throw new Error("<NotchedOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noLabel() {
    		throw new Error("<NotchedOutline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noLabel(value) {
    		throw new Error("<NotchedOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get notch() {
    		return this.$$.ctx[10];
    	}

    	set notch(value) {
    		throw new Error("<NotchedOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeNotch() {
    		return this.$$.ctx[11];
    	}

    	set closeNotch(value) {
    		throw new Error("<NotchedOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[12];
    	}

    	set getElement(value) {
    		throw new Error("<NotchedOutline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/common/dist/elements/Div.svelte generated by Svelte v3.46.4 */
    const file$g = "node_modules/@smui/common/dist/elements/Div.svelte";

    function create_fragment$i(ctx) {
    	let div;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let div_levels = [/*$$restProps*/ ctx[3]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$g, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[7](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[2].call(null, div))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Div', slots, ['default']);
    	let { use = [] } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element;

    	function getElement() {
    		return element;
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		use,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Div$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$i, safe_not_equal, { use: 0, getElement: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Div",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get use() {
    		throw new Error("<Div>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Div>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[4];
    	}

    	set getElement(value) {
    		throw new Error("<Div>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/common/dist/classadder/ClassAdder.svelte generated by Svelte v3.46.4 */

    // (1:0) <svelte:component   this={component}   bind:this={element}   use={[forwardEvents, ...use]}   class={classMap({     [className]: true,     [smuiClass]: true,     ...smuiClassMap,   })}   {...props}   {...$$restProps}>
    function create_default_slot$7(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(1:0) <svelte:component   this={component}   bind:this={element}   use={[forwardEvents, ...use]}   class={classMap({     [className]: true,     [smuiClass]: true,     ...smuiClassMap,   })}   {...props}   {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{
    			use: [/*forwardEvents*/ ctx[7], .../*use*/ ctx[0]]
    		},
    		{
    			class: classMap({
    				[/*className*/ ctx[1]]: true,
    				[/*smuiClass*/ ctx[5]]: true,
    				.../*smuiClassMap*/ ctx[4]
    			})
    		},
    		/*props*/ ctx[6],
    		/*$$restProps*/ ctx[8]
    	];

    	var switch_value = /*component*/ ctx[2];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot$7] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		/*switch_instance_binding*/ ctx[11](switch_instance);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = (dirty & /*forwardEvents, use, classMap, className, smuiClass, smuiClassMap, props, $$restProps*/ 499)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*forwardEvents, use*/ 129 && {
    						use: [/*forwardEvents*/ ctx[7], .../*use*/ ctx[0]]
    					},
    					dirty & /*classMap, className, smuiClass, smuiClassMap*/ 50 && {
    						class: classMap({
    							[/*className*/ ctx[1]]: true,
    							[/*smuiClass*/ ctx[5]]: true,
    							.../*smuiClassMap*/ ctx[4]
    						})
    					},
    					dirty & /*props*/ 64 && get_spread_object(/*props*/ ctx[6]),
    					dirty & /*$$restProps*/ 256 && get_spread_object(/*$$restProps*/ ctx[8])
    				])
    			: {};

    			if (dirty & /*$$scope*/ 4096) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*component*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					/*switch_instance_binding*/ ctx[11](switch_instance);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*switch_instance_binding*/ ctx[11](null);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const internals = {
    	component: Div$1,
    	class: '',
    	classMap: {},
    	contexts: {},
    	props: {}
    };

    function instance$c($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","component","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ClassAdder', slots, ['default']);
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let element;
    	const smuiClass = internals.class;
    	const smuiClassMap = {};
    	const smuiClassUnsubscribes = [];
    	const contexts = internals.contexts;
    	const props = internals.props;
    	let { component = internals.component } = $$props;

    	Object.entries(internals.classMap).forEach(([name, context]) => {
    		const store = getContext(context);

    		if (store && 'subscribe' in store) {
    			smuiClassUnsubscribes.push(store.subscribe(value => {
    				$$invalidate(4, smuiClassMap[name] = value, smuiClassMap);
    			}));
    		}
    	});

    	const forwardEvents = forwardEventsBuilder(get_current_component());

    	for (let context in contexts) {
    		if (contexts.hasOwnProperty(context)) {
    			setContext(context, contexts[context]);
    		}
    	}

    	onDestroy(() => {
    		for (const unsubscribe of smuiClassUnsubscribes) {
    			unsubscribe();
    		}
    	});

    	function getElement() {
    		return element.getElement();
    	}

    	function switch_instance_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(3, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('component' in $$new_props) $$invalidate(2, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Div: Div$1,
    		internals,
    		onDestroy,
    		getContext,
    		setContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		use,
    		className,
    		element,
    		smuiClass,
    		smuiClassMap,
    		smuiClassUnsubscribes,
    		contexts,
    		props,
    		component,
    		forwardEvents,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(3, element = $$new_props.element);
    		if ('component' in $$props) $$invalidate(2, component = $$new_props.component);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		component,
    		element,
    		smuiClassMap,
    		smuiClass,
    		props,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		slots,
    		switch_instance_binding,
    		$$scope
    	];
    }

    class ClassAdder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$h, safe_not_equal, {
    			use: 0,
    			class: 1,
    			component: 2,
    			getElement: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClassAdder",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get use() {
    		throw new Error("<ClassAdder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<ClassAdder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<ClassAdder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ClassAdder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<ClassAdder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<ClassAdder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[9];
    	}

    	set getElement(value) {
    		throw new Error("<ClassAdder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // @ts-ignore: Internals is exported... argh.
    const defaults$1 = Object.assign({}, internals);
    function classAdderBuilder(props) {
        return new Proxy(ClassAdder, {
            construct: function (target, args) {
                Object.assign(internals, defaults$1, props);
                // @ts-ignore: Need spread arg.
                return new target(...args);
            },
            get: function (target, prop) {
                Object.assign(internals, defaults$1, props);
                return target[prop];
            },
        });
    }

    /* node_modules/@smui/common/dist/elements/A.svelte generated by Svelte v3.46.4 */
    const file$f = "node_modules/@smui/common/dist/elements/A.svelte";

    function create_fragment$g(ctx) {
    	let a;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
    	let a_levels = [{ href: /*href*/ ctx[1] }, /*$$restProps*/ ctx[4]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$f, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			/*a_binding*/ ctx[8](a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, a, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[3].call(null, a))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 2) && { href: /*href*/ ctx[1] },
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			/*a_binding*/ ctx[8](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","href","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('A', slots, ['default']);
    	let { use = [] } = $$props;
    	let { href = 'javascript:void(0);' } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element;

    	function getElement() {
    		return element;
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('href' in $$new_props) $$invalidate(1, href = $$new_props.href);
    		if ('$$scope' in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		use,
    		href,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('href' in $$props) $$invalidate(1, href = $$new_props.href);
    		if ('element' in $$props) $$invalidate(2, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		href,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		a_binding
    	];
    }

    class A$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$g, safe_not_equal, { use: 0, href: 1, getElement: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "A",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get use() {
    		throw new Error("<A>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<A>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[5];
    	}

    	set getElement(value) {
    		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/common/dist/elements/Button.svelte generated by Svelte v3.46.4 */
    const file$e = "node_modules/@smui/common/dist/elements/Button.svelte";

    function create_fragment$f(ctx) {
    	let button;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let button_levels = [/*$$restProps*/ ctx[3]];
    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			set_attributes(button, button_data);
    			add_location(button, file$e, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[7](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, button, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[2].call(null, button))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			/*button_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { use = [] } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element;

    	function getElement() {
    		return element;
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		use,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		button_binding
    	];
    }

    class Button$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$f, safe_not_equal, { use: 0, getElement: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get use() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[4];
    	}

    	set getElement(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const A = A$1;
    const Button = Button$1;
    const Div = Div$1;
    const Span = Span$1;

    var HelperLine = classAdderBuilder({
        class: 'mdc-text-field-helper-line',
        component: Div,
    });

    var Prefix = classAdderBuilder({
        class: 'mdc-text-field__affix mdc-text-field__affix--prefix',
        component: Span,
    });

    var Suffix = classAdderBuilder({
        class: 'mdc-text-field__affix mdc-text-field__affix--suffix',
        component: Span,
    });

    /* node_modules/@smui/textfield/dist/Input.svelte generated by Svelte v3.46.4 */
    const file$d = "node_modules/@smui/textfield/dist/Input.svelte";

    function create_fragment$e(ctx) {
    	let input;
    	let input_class_value;
    	let useActions_action;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		{
    			class: input_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-text-field__input': true
    			})
    		},
    		{ type: /*type*/ ctx[2] },
    		{ placeholder: /*placeholder*/ ctx[3] },
    		/*valueProp*/ ctx[4],
    		/*internalAttrs*/ ctx[6],
    		/*$$restProps*/ ctx[10]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$d, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			/*input_binding*/ ctx[26](input);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, input, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[7].call(null, input)),
    					listen_dev(input, "input", /*input_handler*/ ctx[27], false, false, false),
    					listen_dev(input, "change", /*changeHandler*/ ctx[9], false, false, false),
    					listen_dev(input, "blur", /*blur_handler*/ ctx[24], false, false, false),
    					listen_dev(input, "focus", /*focus_handler*/ ctx[25], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty & /*className*/ 2 && input_class_value !== (input_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-text-field__input': true
    				})) && { class: input_class_value },
    				dirty & /*type*/ 4 && { type: /*type*/ ctx[2] },
    				dirty & /*placeholder*/ 8 && { placeholder: /*placeholder*/ ctx[3] },
    				dirty & /*valueProp*/ 16 && /*valueProp*/ ctx[4],
    				dirty & /*internalAttrs*/ 64 && /*internalAttrs*/ ctx[6],
    				dirty & /*$$restProps*/ 1024 && /*$$restProps*/ ctx[10]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding*/ ctx[26](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function toNumber(value) {
    	if (value === '') {
    		const nan = new Number(Number.NaN);
    		nan.length = 0;
    		return nan;
    	}

    	return +value;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","type","placeholder","value","files","dirty","invalid","updateInvalid","emptyValueNull","emptyValueUndefined","getAttr","addAttr","removeAttr","focus","blur","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Input', slots, []);
    	const forwardEvents = forwardEventsBuilder(get_current_component());

    	let uninitializedValue = () => {
    		
    	};

    	function isUninitializedValue(value) {
    		return value === uninitializedValue;
    	}

    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { type = 'text' } = $$props;
    	let { placeholder = ' ' } = $$props;
    	let { value = uninitializedValue } = $$props;
    	const valueUninitialized = isUninitializedValue(value);

    	if (valueUninitialized) {
    		value = '';
    	}

    	let { files = null } = $$props;
    	let { dirty = false } = $$props;
    	let { invalid = false } = $$props;
    	let { updateInvalid = true } = $$props;
    	let { emptyValueNull = value === null } = $$props;

    	if (valueUninitialized && emptyValueNull) {
    		value = null;
    	}

    	let { emptyValueUndefined = value === undefined } = $$props;

    	if (valueUninitialized && emptyValueUndefined) {
    		value = undefined;
    	}

    	let element;
    	let internalAttrs = {};
    	let valueProp = {};

    	onMount(() => {
    		if (updateInvalid) {
    			$$invalidate(14, invalid = element.matches(':invalid'));
    		}
    	});

    	function valueUpdater(e) {
    		if (type === 'file') {
    			$$invalidate(12, files = e.currentTarget.files);
    			return;
    		}

    		if (e.currentTarget.value === '' && emptyValueNull) {
    			$$invalidate(11, value = null);
    			return;
    		}

    		if (e.currentTarget.value === '' && emptyValueUndefined) {
    			$$invalidate(11, value = undefined);
    			return;
    		}

    		switch (type) {
    			case 'number':
    			case 'range':
    				$$invalidate(11, value = toNumber(e.currentTarget.value));
    				break;
    			default:
    				$$invalidate(11, value = e.currentTarget.value);
    				break;
    		}
    	}

    	function changeHandler(e) {
    		if (type === 'file' || type === 'range') {
    			valueUpdater(e);
    		}

    		$$invalidate(13, dirty = true);

    		if (updateInvalid) {
    			$$invalidate(14, invalid = element.matches(':invalid'));
    		}
    	}

    	function getAttr(name) {
    		var _a;

    		return name in internalAttrs
    		? (_a = internalAttrs[name]) !== null && _a !== void 0
    			? _a
    			: null
    		: getElement().getAttribute(name);
    	}

    	function addAttr(name, value) {
    		if (internalAttrs[name] !== value) {
    			$$invalidate(6, internalAttrs[name] = value, internalAttrs);
    		}
    	}

    	function removeAttr(name) {
    		if (!(name in internalAttrs) || internalAttrs[name] != null) {
    			$$invalidate(6, internalAttrs[name] = undefined, internalAttrs);
    		}
    	}

    	function focus() {
    		getElement().focus();
    	}

    	function blur() {
    		getElement().blur();
    	}

    	function getElement() {
    		return element;
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(5, element);
    		});
    	}

    	const input_handler = e => type !== 'file' && valueUpdater(e);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('type' in $$new_props) $$invalidate(2, type = $$new_props.type);
    		if ('placeholder' in $$new_props) $$invalidate(3, placeholder = $$new_props.placeholder);
    		if ('value' in $$new_props) $$invalidate(11, value = $$new_props.value);
    		if ('files' in $$new_props) $$invalidate(12, files = $$new_props.files);
    		if ('dirty' in $$new_props) $$invalidate(13, dirty = $$new_props.dirty);
    		if ('invalid' in $$new_props) $$invalidate(14, invalid = $$new_props.invalid);
    		if ('updateInvalid' in $$new_props) $$invalidate(15, updateInvalid = $$new_props.updateInvalid);
    		if ('emptyValueNull' in $$new_props) $$invalidate(16, emptyValueNull = $$new_props.emptyValueNull);
    		if ('emptyValueUndefined' in $$new_props) $$invalidate(17, emptyValueUndefined = $$new_props.emptyValueUndefined);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		forwardEvents,
    		uninitializedValue,
    		isUninitializedValue,
    		use,
    		className,
    		type,
    		placeholder,
    		value,
    		valueUninitialized,
    		files,
    		dirty,
    		invalid,
    		updateInvalid,
    		emptyValueNull,
    		emptyValueUndefined,
    		element,
    		internalAttrs,
    		valueProp,
    		toNumber,
    		valueUpdater,
    		changeHandler,
    		getAttr,
    		addAttr,
    		removeAttr,
    		focus,
    		blur,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('uninitializedValue' in $$props) uninitializedValue = $$new_props.uninitializedValue;
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('type' in $$props) $$invalidate(2, type = $$new_props.type);
    		if ('placeholder' in $$props) $$invalidate(3, placeholder = $$new_props.placeholder);
    		if ('value' in $$props) $$invalidate(11, value = $$new_props.value);
    		if ('files' in $$props) $$invalidate(12, files = $$new_props.files);
    		if ('dirty' in $$props) $$invalidate(13, dirty = $$new_props.dirty);
    		if ('invalid' in $$props) $$invalidate(14, invalid = $$new_props.invalid);
    		if ('updateInvalid' in $$props) $$invalidate(15, updateInvalid = $$new_props.updateInvalid);
    		if ('emptyValueNull' in $$props) $$invalidate(16, emptyValueNull = $$new_props.emptyValueNull);
    		if ('emptyValueUndefined' in $$props) $$invalidate(17, emptyValueUndefined = $$new_props.emptyValueUndefined);
    		if ('element' in $$props) $$invalidate(5, element = $$new_props.element);
    		if ('internalAttrs' in $$props) $$invalidate(6, internalAttrs = $$new_props.internalAttrs);
    		if ('valueProp' in $$props) $$invalidate(4, valueProp = $$new_props.valueProp);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*type, valueProp, value*/ 2068) {
    			if (type === 'file') {
    				delete valueProp.value;
    				(($$invalidate(4, valueProp), $$invalidate(2, type)), $$invalidate(11, value));
    			} else {
    				$$invalidate(4, valueProp.value = value == null ? '' : value, valueProp);
    			}
    		}
    	};

    	return [
    		use,
    		className,
    		type,
    		placeholder,
    		valueProp,
    		element,
    		internalAttrs,
    		forwardEvents,
    		valueUpdater,
    		changeHandler,
    		$$restProps,
    		value,
    		files,
    		dirty,
    		invalid,
    		updateInvalid,
    		emptyValueNull,
    		emptyValueUndefined,
    		getAttr,
    		addAttr,
    		removeAttr,
    		focus,
    		blur,
    		getElement,
    		blur_handler,
    		focus_handler,
    		input_binding,
    		input_handler
    	];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$e, safe_not_equal, {
    			use: 0,
    			class: 1,
    			type: 2,
    			placeholder: 3,
    			value: 11,
    			files: 12,
    			dirty: 13,
    			invalid: 14,
    			updateInvalid: 15,
    			emptyValueNull: 16,
    			emptyValueUndefined: 17,
    			getAttr: 18,
    			addAttr: 19,
    			removeAttr: 20,
    			focus: 21,
    			blur: 22,
    			getElement: 23
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get use() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get files() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set files(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dirty() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dirty(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get updateInvalid() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set updateInvalid(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get emptyValueNull() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set emptyValueNull(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get emptyValueUndefined() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set emptyValueUndefined(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getAttr() {
    		return this.$$.ctx[18];
    	}

    	set getAttr(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addAttr() {
    		return this.$$.ctx[19];
    	}

    	set addAttr(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get removeAttr() {
    		return this.$$.ctx[20];
    	}

    	set removeAttr(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focus() {
    		return this.$$.ctx[21];
    	}

    	set focus(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blur() {
    		return this.$$.ctx[22];
    	}

    	set blur(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[23];
    	}

    	set getElement(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/textfield/dist/Textarea.svelte generated by Svelte v3.46.4 */
    const file$c = "node_modules/@smui/textfield/dist/Textarea.svelte";

    function create_fragment$d(ctx) {
    	let textarea;
    	let textarea_class_value;
    	let textarea_style_value;
    	let useActions_action;
    	let mounted;
    	let dispose;

    	let textarea_levels = [
    		{
    			class: textarea_class_value = classMap({
    				[/*className*/ ctx[2]]: true,
    				'mdc-text-field__input': true
    			})
    		},
    		{
    			style: textarea_style_value = `${/*resizable*/ ctx[4] ? '' : 'resize: none; '}${/*style*/ ctx[3]}`
    		},
    		/*internalAttrs*/ ctx[6],
    		/*$$restProps*/ ctx[9]
    	];

    	let textarea_data = {};

    	for (let i = 0; i < textarea_levels.length; i += 1) {
    		textarea_data = assign(textarea_data, textarea_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			set_attributes(textarea, textarea_data);
    			add_location(textarea, file$c, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			if (textarea.autofocus) textarea.focus();
    			/*textarea_binding*/ ctx[21](textarea);
    			set_input_value(textarea, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, textarea, /*use*/ ctx[1])),
    					action_destroyer(/*forwardEvents*/ ctx[7].call(null, textarea)),
    					listen_dev(textarea, "change", /*changeHandler*/ ctx[8], false, false, false),
    					listen_dev(textarea, "blur", /*blur_handler*/ ctx[19], false, false, false),
    					listen_dev(textarea, "focus", /*focus_handler*/ ctx[20], false, false, false),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[22])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(textarea, textarea_data = get_spread_update(textarea_levels, [
    				dirty & /*className*/ 4 && textarea_class_value !== (textarea_class_value = classMap({
    					[/*className*/ ctx[2]]: true,
    					'mdc-text-field__input': true
    				})) && { class: textarea_class_value },
    				dirty & /*resizable, style*/ 24 && textarea_style_value !== (textarea_style_value = `${/*resizable*/ ctx[4] ? '' : 'resize: none; '}${/*style*/ ctx[3]}`) && { style: textarea_style_value },
    				dirty & /*internalAttrs*/ 64 && /*internalAttrs*/ ctx[6],
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 2) useActions_action.update.call(null, /*use*/ ctx[1]);

    			if (dirty & /*value*/ 1) {
    				set_input_value(textarea, /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			/*textarea_binding*/ ctx[21](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","style","value","dirty","invalid","updateInvalid","resizable","getAttr","addAttr","removeAttr","focus","blur","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Textarea', slots, []);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
    	let { value = '' } = $$props;
    	let { dirty = false } = $$props;
    	let { invalid = false } = $$props;
    	let { updateInvalid = true } = $$props;
    	let { resizable = true } = $$props;
    	let element;
    	let internalAttrs = {};

    	onMount(() => {
    		if (updateInvalid) {
    			$$invalidate(11, invalid = element.matches(':invalid'));
    		}
    	});

    	function changeHandler() {
    		$$invalidate(10, dirty = true);

    		if (updateInvalid) {
    			$$invalidate(11, invalid = element.matches(':invalid'));
    		}
    	}

    	function getAttr(name) {
    		var _a;

    		return name in internalAttrs
    		? (_a = internalAttrs[name]) !== null && _a !== void 0
    			? _a
    			: null
    		: getElement().getAttribute(name);
    	}

    	function addAttr(name, value) {
    		if (internalAttrs[name] !== value) {
    			$$invalidate(6, internalAttrs[name] = value, internalAttrs);
    		}
    	}

    	function removeAttr(name) {
    		if (!(name in internalAttrs) || internalAttrs[name] != null) {
    			$$invalidate(6, internalAttrs[name] = undefined, internalAttrs);
    		}
    	}

    	function focus() {
    		getElement().focus();
    	}

    	function blur() {
    		getElement().blur();
    	}

    	function getElement() {
    		return element;
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function textarea_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(5, element);
    		});
    	}

    	function textarea_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('dirty' in $$new_props) $$invalidate(10, dirty = $$new_props.dirty);
    		if ('invalid' in $$new_props) $$invalidate(11, invalid = $$new_props.invalid);
    		if ('updateInvalid' in $$new_props) $$invalidate(12, updateInvalid = $$new_props.updateInvalid);
    		if ('resizable' in $$new_props) $$invalidate(4, resizable = $$new_props.resizable);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		forwardEvents,
    		use,
    		className,
    		style,
    		value,
    		dirty,
    		invalid,
    		updateInvalid,
    		resizable,
    		element,
    		internalAttrs,
    		changeHandler,
    		getAttr,
    		addAttr,
    		removeAttr,
    		focus,
    		blur,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(1, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(3, style = $$new_props.style);
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('dirty' in $$props) $$invalidate(10, dirty = $$new_props.dirty);
    		if ('invalid' in $$props) $$invalidate(11, invalid = $$new_props.invalid);
    		if ('updateInvalid' in $$props) $$invalidate(12, updateInvalid = $$new_props.updateInvalid);
    		if ('resizable' in $$props) $$invalidate(4, resizable = $$new_props.resizable);
    		if ('element' in $$props) $$invalidate(5, element = $$new_props.element);
    		if ('internalAttrs' in $$props) $$invalidate(6, internalAttrs = $$new_props.internalAttrs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		use,
    		className,
    		style,
    		resizable,
    		element,
    		internalAttrs,
    		forwardEvents,
    		changeHandler,
    		$$restProps,
    		dirty,
    		invalid,
    		updateInvalid,
    		getAttr,
    		addAttr,
    		removeAttr,
    		focus,
    		blur,
    		getElement,
    		blur_handler,
    		focus_handler,
    		textarea_binding,
    		textarea_input_handler
    	];
    }

    class Textarea extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$d, safe_not_equal, {
    			use: 1,
    			class: 2,
    			style: 3,
    			value: 0,
    			dirty: 10,
    			invalid: 11,
    			updateInvalid: 12,
    			resizable: 4,
    			getAttr: 13,
    			addAttr: 14,
    			removeAttr: 15,
    			focus: 16,
    			blur: 17,
    			getElement: 18
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Textarea",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get use() {
    		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dirty() {
    		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dirty(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get updateInvalid() {
    		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set updateInvalid(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get resizable() {
    		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set resizable(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getAttr() {
    		return this.$$.ctx[13];
    	}

    	set getAttr(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addAttr() {
    		return this.$$.ctx[14];
    	}

    	set addAttr(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get removeAttr() {
    		return this.$$.ctx[15];
    	}

    	set removeAttr(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focus() {
    		return this.$$.ctx[16];
    	}

    	set focus(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blur() {
    		return this.$$.ctx[17];
    	}

    	set blur(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[18];
    	}

    	set getElement(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/textfield/dist/Textfield.svelte generated by Svelte v3.46.4 */

    const { Error: Error_1$1 } = globals;
    const file$b = "node_modules/@smui/textfield/dist/Textfield.svelte";
    const get_helper_slot_changes = dirty => ({});
    const get_helper_slot_context = ctx => ({});
    const get_ripple_slot_changes = dirty => ({});
    const get_ripple_slot_context = ctx => ({});
    const get_trailingIcon_slot_changes_1 = dirty => ({});
    const get_trailingIcon_slot_context_1 = ctx => ({});
    const get_leadingIcon_slot_changes_1 = dirty => ({});
    const get_leadingIcon_slot_context_1 = ctx => ({});
    const get_label_slot_changes_2 = dirty => ({});
    const get_label_slot_context_2 = ctx => ({});
    const get_trailingIcon_slot_changes = dirty => ({});
    const get_trailingIcon_slot_context = ctx => ({});
    const get_suffix_slot_changes = dirty => ({});
    const get_suffix_slot_context = ctx => ({});
    const get_prefix_slot_changes = dirty => ({});
    const get_prefix_slot_context = ctx => ({});
    const get_internalCounter_slot_changes = dirty => ({});
    const get_internalCounter_slot_context = ctx => ({});
    const get_leadingIcon_slot_changes = dirty => ({});
    const get_leadingIcon_slot_context = ctx => ({});
    const get_label_slot_changes_1 = dirty => ({});
    const get_label_slot_context_1 = ctx => ({});
    const get_label_slot_changes = dirty => ({});
    const get_label_slot_context = ctx => ({});

    // (163:0) {:else}
    function create_else_block_1(ctx) {
    	let div;
    	let t0;
    	let contextfragment0;
    	let t1;
    	let t2;
    	let contextfragment1;
    	let t3;
    	let div_class_value;
    	let div_style_value;
    	let Ripple_action;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const label_slot_template = /*#slots*/ ctx[51].label;
    	const label_slot = create_slot(label_slot_template, ctx, /*$$scope*/ ctx[90], get_label_slot_context_2);

    	contextfragment0 = new ContextFragment({
    			props: {
    				key: "SMUI:textfield:icon:leading",
    				value: true,
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const default_slot_template = /*#slots*/ ctx[51].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[90], null);

    	contextfragment1 = new ContextFragment({
    			props: {
    				key: "SMUI:textfield:icon:leading",
    				value: false,
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const ripple_slot_template = /*#slots*/ ctx[51].ripple;
    	const ripple_slot = create_slot(ripple_slot_template, ctx, /*$$scope*/ ctx[90], get_ripple_slot_context);

    	let div_levels = [
    		{
    			class: div_class_value = classMap({
    				[/*className*/ ctx[9]]: true,
    				'mdc-text-field': true,
    				'mdc-text-field--disabled': /*disabled*/ ctx[12],
    				'mdc-text-field--textarea': /*textarea*/ ctx[14],
    				'mdc-text-field--filled': /*variant*/ ctx[15] === 'filled',
    				'mdc-text-field--outlined': /*variant*/ ctx[15] === 'outlined',
    				'smui-text-field--standard': /*variant*/ ctx[15] === 'standard' && !/*textarea*/ ctx[14],
    				'mdc-text-field--no-label': /*noLabel*/ ctx[16] || !/*$$slots*/ ctx[42].label,
    				'mdc-text-field--with-leading-icon': /*$$slots*/ ctx[42].leadingIcon,
    				'mdc-text-field--with-trailing-icon': /*$$slots*/ ctx[42].trailingIcon,
    				'mdc-text-field--invalid': /*invalid*/ ctx[1],
    				.../*internalClasses*/ ctx[25]
    			})
    		},
    		{
    			style: div_style_value = Object.entries(/*internalStyles*/ ctx[26]).map(func_1).concat([/*style*/ ctx[10]]).join(' ')
    		},
    		exclude(/*$$restProps*/ ctx[41], ['input$', 'label$', 'ripple$', 'outline$', 'helperLine$'])
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (label_slot) label_slot.c();
    			t0 = space();
    			create_component(contextfragment0.$$.fragment);
    			t1 = space();
    			if (default_slot) default_slot.c();
    			t2 = space();
    			create_component(contextfragment1.$$.fragment);
    			t3 = space();
    			if (ripple_slot) ripple_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$b, 163, 2, 5417);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (label_slot) {
    				label_slot.m(div, null);
    			}

    			append_dev(div, t0);
    			mount_component(contextfragment0, div, null);
    			append_dev(div, t1);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(div, t2);
    			mount_component(contextfragment1, div, null);
    			append_dev(div, t3);

    			if (ripple_slot) {
    				ripple_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[80](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(Ripple_action = Ripple.call(null, div, {
    						ripple: /*ripple*/ ctx[11],
    						unbounded: false,
    						addClass: /*addClass*/ ctx[38],
    						removeClass: /*removeClass*/ ctx[39],
    						addStyle: /*addStyle*/ ctx[40]
    					})),
    					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[8])),
    					action_destroyer(/*forwardEvents*/ ctx[34].call(null, div)),
    					listen_dev(div, "SMUITextfieldLeadingIcon:mount", /*SMUITextfieldLeadingIcon_mount_handler_1*/ ctx[81], false, false, false),
    					listen_dev(div, "SMUITextfieldLeadingIcon:unmount", /*SMUITextfieldLeadingIcon_unmount_handler_1*/ ctx[82], false, false, false),
    					listen_dev(div, "SMUITextfieldTrailingIcon:mount", /*SMUITextfieldTrailingIcon_mount_handler_1*/ ctx[83], false, false, false),
    					listen_dev(div, "SMUITextfieldTrailingIcon:unmount", /*SMUITextfieldTrailingIcon_unmount_handler_1*/ ctx[84], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (label_slot) {
    				if (label_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						label_slot,
    						label_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(label_slot_template, /*$$scope*/ ctx[90], dirty, get_label_slot_changes_2),
    						get_label_slot_context_2
    					);
    				}
    			}

    			const contextfragment0_changes = {};

    			if (dirty[2] & /*$$scope*/ 268435456) {
    				contextfragment0_changes.$$scope = { dirty, ctx };
    			}

    			contextfragment0.$set(contextfragment0_changes);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[90], dirty, null),
    						null
    					);
    				}
    			}

    			const contextfragment1_changes = {};

    			if (dirty[2] & /*$$scope*/ 268435456) {
    				contextfragment1_changes.$$scope = { dirty, ctx };
    			}

    			contextfragment1.$set(contextfragment1_changes);

    			if (ripple_slot) {
    				if (ripple_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						ripple_slot,
    						ripple_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(ripple_slot_template, /*$$scope*/ ctx[90], dirty, get_ripple_slot_changes),
    						get_ripple_slot_context
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty[0] & /*className, disabled, textarea, variant, noLabel, invalid, internalClasses*/ 33673730 | dirty[1] & /*$$slots*/ 2048 && div_class_value !== (div_class_value = classMap({
    					[/*className*/ ctx[9]]: true,
    					'mdc-text-field': true,
    					'mdc-text-field--disabled': /*disabled*/ ctx[12],
    					'mdc-text-field--textarea': /*textarea*/ ctx[14],
    					'mdc-text-field--filled': /*variant*/ ctx[15] === 'filled',
    					'mdc-text-field--outlined': /*variant*/ ctx[15] === 'outlined',
    					'smui-text-field--standard': /*variant*/ ctx[15] === 'standard' && !/*textarea*/ ctx[14],
    					'mdc-text-field--no-label': /*noLabel*/ ctx[16] || !/*$$slots*/ ctx[42].label,
    					'mdc-text-field--with-leading-icon': /*$$slots*/ ctx[42].leadingIcon,
    					'mdc-text-field--with-trailing-icon': /*$$slots*/ ctx[42].trailingIcon,
    					'mdc-text-field--invalid': /*invalid*/ ctx[1],
    					.../*internalClasses*/ ctx[25]
    				}))) && { class: div_class_value },
    				(!current || dirty[0] & /*internalStyles, style*/ 67109888 && div_style_value !== (div_style_value = Object.entries(/*internalStyles*/ ctx[26]).map(func_1).concat([/*style*/ ctx[10]]).join(' '))) && { style: div_style_value },
    				dirty[1] & /*$$restProps*/ 1024 && exclude(/*$$restProps*/ ctx[41], ['input$', 'label$', 'ripple$', 'outline$', 'helperLine$'])
    			]));

    			if (Ripple_action && is_function(Ripple_action.update) && dirty[0] & /*ripple*/ 2048) Ripple_action.update.call(null, {
    				ripple: /*ripple*/ ctx[11],
    				unbounded: false,
    				addClass: /*addClass*/ ctx[38],
    				removeClass: /*removeClass*/ ctx[39],
    				addStyle: /*addStyle*/ ctx[40]
    			});

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*use*/ 256) useActions_action.update.call(null, /*use*/ ctx[8]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label_slot, local);
    			transition_in(contextfragment0.$$.fragment, local);
    			transition_in(default_slot, local);
    			transition_in(contextfragment1.$$.fragment, local);
    			transition_in(ripple_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label_slot, local);
    			transition_out(contextfragment0.$$.fragment, local);
    			transition_out(default_slot, local);
    			transition_out(contextfragment1.$$.fragment, local);
    			transition_out(ripple_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (label_slot) label_slot.d(detaching);
    			destroy_component(contextfragment0);
    			if (default_slot) default_slot.d(detaching);
    			destroy_component(contextfragment1);
    			if (ripple_slot) ripple_slot.d(detaching);
    			/*div_binding*/ ctx[80](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(163:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (1:0) {#if valued}
    function create_if_block_1$2(ctx) {
    	let label_1;
    	let t0;
    	let t1;
    	let contextfragment0;
    	let t2;
    	let t3;
    	let current_block_type_index;
    	let if_block2;
    	let t4;
    	let contextfragment1;
    	let t5;
    	let label_1_class_value;
    	let label_1_style_value;
    	let Ripple_action;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = !/*textarea*/ ctx[14] && /*variant*/ ctx[15] !== 'outlined' && create_if_block_8(ctx);
    	let if_block1 = (/*textarea*/ ctx[14] || /*variant*/ ctx[15] === 'outlined') && create_if_block_6(ctx);

    	contextfragment0 = new ContextFragment({
    			props: {
    				key: "SMUI:textfield:icon:leading",
    				value: true,
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const default_slot_template = /*#slots*/ ctx[51].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[90], null);
    	const if_block_creators = [create_if_block_3, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*textarea*/ ctx[14] && typeof /*value*/ ctx[0] === 'string') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	contextfragment1 = new ContextFragment({
    			props: {
    				key: "SMUI:textfield:icon:leading",
    				value: false,
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block3 = !/*textarea*/ ctx[14] && /*variant*/ ctx[15] !== 'outlined' && /*ripple*/ ctx[11] && create_if_block_2(ctx);

    	let label_1_levels = [
    		{
    			class: label_1_class_value = classMap({
    				[/*className*/ ctx[9]]: true,
    				'mdc-text-field': true,
    				'mdc-text-field--disabled': /*disabled*/ ctx[12],
    				'mdc-text-field--textarea': /*textarea*/ ctx[14],
    				'mdc-text-field--filled': /*variant*/ ctx[15] === 'filled',
    				'mdc-text-field--outlined': /*variant*/ ctx[15] === 'outlined',
    				'smui-text-field--standard': /*variant*/ ctx[15] === 'standard' && !/*textarea*/ ctx[14],
    				'mdc-text-field--no-label': /*noLabel*/ ctx[16] || /*label*/ ctx[17] == null && !/*$$slots*/ ctx[42].label,
    				'mdc-text-field--label-floating': /*focused*/ ctx[28] || /*value*/ ctx[0] != null && /*value*/ ctx[0] !== '',
    				'mdc-text-field--with-leading-icon': /*isUninitializedValue*/ ctx[35](/*withLeadingIcon*/ ctx[22])
    				? /*$$slots*/ ctx[42].leadingIcon
    				: /*withLeadingIcon*/ ctx[22],
    				'mdc-text-field--with-trailing-icon': /*isUninitializedValue*/ ctx[35](/*withTrailingIcon*/ ctx[23])
    				? /*$$slots*/ ctx[42].trailingIcon
    				: /*withTrailingIcon*/ ctx[23],
    				'mdc-text-field--with-internal-counter': /*textarea*/ ctx[14] && /*$$slots*/ ctx[42].internalCounter,
    				'mdc-text-field--invalid': /*invalid*/ ctx[1],
    				.../*internalClasses*/ ctx[25]
    			})
    		},
    		{
    			style: label_1_style_value = Object.entries(/*internalStyles*/ ctx[26]).map(func$4).concat([/*style*/ ctx[10]]).join(' ')
    		},
    		{
    			for: /* suppress a11y warning, since this is wrapped */ undefined
    		},
    		exclude(/*$$restProps*/ ctx[41], ['input$', 'label$', 'ripple$', 'outline$', 'helperLine$'])
    	];

    	let label_1_data = {};

    	for (let i = 0; i < label_1_levels.length; i += 1) {
    		label_1_data = assign(label_1_data, label_1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			label_1 = element("label");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			create_component(contextfragment0.$$.fragment);
    			t2 = space();
    			if (default_slot) default_slot.c();
    			t3 = space();
    			if_block2.c();
    			t4 = space();
    			create_component(contextfragment1.$$.fragment);
    			t5 = space();
    			if (if_block3) if_block3.c();
    			set_attributes(label_1, label_1_data);
    			add_location(label_1, file$b, 1, 2, 15);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label_1, anchor);
    			if (if_block0) if_block0.m(label_1, null);
    			append_dev(label_1, t0);
    			if (if_block1) if_block1.m(label_1, null);
    			append_dev(label_1, t1);
    			mount_component(contextfragment0, label_1, null);
    			append_dev(label_1, t2);

    			if (default_slot) {
    				default_slot.m(label_1, null);
    			}

    			append_dev(label_1, t3);
    			if_blocks[current_block_type_index].m(label_1, null);
    			append_dev(label_1, t4);
    			mount_component(contextfragment1, label_1, null);
    			append_dev(label_1, t5);
    			if (if_block3) if_block3.m(label_1, null);
    			/*label_1_binding*/ ctx[73](label_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(Ripple_action = Ripple.call(null, label_1, {
    						ripple: !/*textarea*/ ctx[14] && /*variant*/ ctx[15] === 'filled',
    						unbounded: false,
    						addClass: /*addClass*/ ctx[38],
    						removeClass: /*removeClass*/ ctx[39],
    						addStyle: /*addStyle*/ ctx[40],
    						eventTarget: /*inputElement*/ ctx[33],
    						activeTarget: /*inputElement*/ ctx[33],
    						initPromise: /*initPromise*/ ctx[37]
    					})),
    					action_destroyer(useActions_action = useActions.call(null, label_1, /*use*/ ctx[8])),
    					action_destroyer(/*forwardEvents*/ ctx[34].call(null, label_1)),
    					listen_dev(label_1, "SMUITextfieldLeadingIcon:mount", /*SMUITextfieldLeadingIcon_mount_handler*/ ctx[74], false, false, false),
    					listen_dev(label_1, "SMUITextfieldLeadingIcon:unmount", /*SMUITextfieldLeadingIcon_unmount_handler*/ ctx[75], false, false, false),
    					listen_dev(label_1, "SMUITextfieldTrailingIcon:mount", /*SMUITextfieldTrailingIcon_mount_handler*/ ctx[76], false, false, false),
    					listen_dev(label_1, "SMUITextfieldTrailingIcon:unmount", /*SMUITextfieldTrailingIcon_unmount_handler*/ ctx[77], false, false, false),
    					listen_dev(label_1, "SMUITextfieldCharacterCounter:mount", /*SMUITextfieldCharacterCounter_mount_handler*/ ctx[78], false, false, false),
    					listen_dev(label_1, "SMUITextfieldCharacterCounter:unmount", /*SMUITextfieldCharacterCounter_unmount_handler*/ ctx[79], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!/*textarea*/ ctx[14] && /*variant*/ ctx[15] !== 'outlined') {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*textarea, variant*/ 49152) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_8(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(label_1, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*textarea*/ ctx[14] || /*variant*/ ctx[15] === 'outlined') {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*textarea, variant*/ 49152) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_6(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(label_1, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const contextfragment0_changes = {};

    			if (dirty[2] & /*$$scope*/ 268435456) {
    				contextfragment0_changes.$$scope = { dirty, ctx };
    			}

    			contextfragment0.$set(contextfragment0_changes);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[90], dirty, null),
    						null
    					);
    				}
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block2 = if_blocks[current_block_type_index];

    				if (!if_block2) {
    					if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block2.c();
    				} else {
    					if_block2.p(ctx, dirty);
    				}

    				transition_in(if_block2, 1);
    				if_block2.m(label_1, t4);
    			}

    			const contextfragment1_changes = {};

    			if (dirty[2] & /*$$scope*/ 268435456) {
    				contextfragment1_changes.$$scope = { dirty, ctx };
    			}

    			contextfragment1.$set(contextfragment1_changes);

    			if (!/*textarea*/ ctx[14] && /*variant*/ ctx[15] !== 'outlined' && /*ripple*/ ctx[11]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty[0] & /*textarea, variant, ripple*/ 51200) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_2(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(label_1, null);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			set_attributes(label_1, label_1_data = get_spread_update(label_1_levels, [
    				(!current || dirty[0] & /*className, disabled, textarea, variant, noLabel, label, focused, value, withLeadingIcon, withTrailingIcon, invalid, internalClasses*/ 314823171 | dirty[1] & /*$$slots*/ 2048 && label_1_class_value !== (label_1_class_value = classMap({
    					[/*className*/ ctx[9]]: true,
    					'mdc-text-field': true,
    					'mdc-text-field--disabled': /*disabled*/ ctx[12],
    					'mdc-text-field--textarea': /*textarea*/ ctx[14],
    					'mdc-text-field--filled': /*variant*/ ctx[15] === 'filled',
    					'mdc-text-field--outlined': /*variant*/ ctx[15] === 'outlined',
    					'smui-text-field--standard': /*variant*/ ctx[15] === 'standard' && !/*textarea*/ ctx[14],
    					'mdc-text-field--no-label': /*noLabel*/ ctx[16] || /*label*/ ctx[17] == null && !/*$$slots*/ ctx[42].label,
    					'mdc-text-field--label-floating': /*focused*/ ctx[28] || /*value*/ ctx[0] != null && /*value*/ ctx[0] !== '',
    					'mdc-text-field--with-leading-icon': /*isUninitializedValue*/ ctx[35](/*withLeadingIcon*/ ctx[22])
    					? /*$$slots*/ ctx[42].leadingIcon
    					: /*withLeadingIcon*/ ctx[22],
    					'mdc-text-field--with-trailing-icon': /*isUninitializedValue*/ ctx[35](/*withTrailingIcon*/ ctx[23])
    					? /*$$slots*/ ctx[42].trailingIcon
    					: /*withTrailingIcon*/ ctx[23],
    					'mdc-text-field--with-internal-counter': /*textarea*/ ctx[14] && /*$$slots*/ ctx[42].internalCounter,
    					'mdc-text-field--invalid': /*invalid*/ ctx[1],
    					.../*internalClasses*/ ctx[25]
    				}))) && { class: label_1_class_value },
    				(!current || dirty[0] & /*internalStyles, style*/ 67109888 && label_1_style_value !== (label_1_style_value = Object.entries(/*internalStyles*/ ctx[26]).map(func$4).concat([/*style*/ ctx[10]]).join(' '))) && { style: label_1_style_value },
    				{
    					for: /* suppress a11y warning, since this is wrapped */ undefined
    				},
    				dirty[1] & /*$$restProps*/ 1024 && exclude(/*$$restProps*/ ctx[41], ['input$', 'label$', 'ripple$', 'outline$', 'helperLine$'])
    			]));

    			if (Ripple_action && is_function(Ripple_action.update) && dirty[0] & /*textarea, variant*/ 49152 | dirty[1] & /*inputElement*/ 4) Ripple_action.update.call(null, {
    				ripple: !/*textarea*/ ctx[14] && /*variant*/ ctx[15] === 'filled',
    				unbounded: false,
    				addClass: /*addClass*/ ctx[38],
    				removeClass: /*removeClass*/ ctx[39],
    				addStyle: /*addStyle*/ ctx[40],
    				eventTarget: /*inputElement*/ ctx[33],
    				activeTarget: /*inputElement*/ ctx[33],
    				initPromise: /*initPromise*/ ctx[37]
    			});

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*use*/ 256) useActions_action.update.call(null, /*use*/ ctx[8]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(contextfragment0.$$.fragment, local);
    			transition_in(default_slot, local);
    			transition_in(if_block2);
    			transition_in(contextfragment1.$$.fragment, local);
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(contextfragment0.$$.fragment, local);
    			transition_out(default_slot, local);
    			transition_out(if_block2);
    			transition_out(contextfragment1.$$.fragment, local);
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label_1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(contextfragment0);
    			if (default_slot) default_slot.d(detaching);
    			if_blocks[current_block_type_index].d();
    			destroy_component(contextfragment1);
    			if (if_block3) if_block3.d();
    			/*label_1_binding*/ ctx[73](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(1:0) {#if valued}",
    		ctx
    	});

    	return block;
    }

    // (207:4) <ContextFragment key="SMUI:textfield:icon:leading" value={true}>
    function create_default_slot_9(ctx) {
    	let current;
    	const leadingIcon_slot_template = /*#slots*/ ctx[51].leadingIcon;
    	const leadingIcon_slot = create_slot(leadingIcon_slot_template, ctx, /*$$scope*/ ctx[90], get_leadingIcon_slot_context_1);

    	const block = {
    		c: function create() {
    			if (leadingIcon_slot) leadingIcon_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (leadingIcon_slot) {
    				leadingIcon_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (leadingIcon_slot) {
    				if (leadingIcon_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						leadingIcon_slot,
    						leadingIcon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(leadingIcon_slot_template, /*$$scope*/ ctx[90], dirty, get_leadingIcon_slot_changes_1),
    						get_leadingIcon_slot_context_1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(leadingIcon_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(leadingIcon_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (leadingIcon_slot) leadingIcon_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(207:4) <ContextFragment key=\\\"SMUI:textfield:icon:leading\\\" value={true}>",
    		ctx
    	});

    	return block;
    }

    // (211:4) <ContextFragment key="SMUI:textfield:icon:leading" value={false}>
    function create_default_slot_8(ctx) {
    	let current;
    	const trailingIcon_slot_template = /*#slots*/ ctx[51].trailingIcon;
    	const trailingIcon_slot = create_slot(trailingIcon_slot_template, ctx, /*$$scope*/ ctx[90], get_trailingIcon_slot_context_1);

    	const block = {
    		c: function create() {
    			if (trailingIcon_slot) trailingIcon_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (trailingIcon_slot) {
    				trailingIcon_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (trailingIcon_slot) {
    				if (trailingIcon_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						trailingIcon_slot,
    						trailingIcon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(trailingIcon_slot_template, /*$$scope*/ ctx[90], dirty, get_trailingIcon_slot_changes_1),
    						get_trailingIcon_slot_context_1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(trailingIcon_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(trailingIcon_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (trailingIcon_slot) trailingIcon_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(211:4) <ContextFragment key=\\\"SMUI:textfield:icon:leading\\\" value={false}>",
    		ctx
    	});

    	return block;
    }

    // (62:4) {#if !textarea && variant !== 'outlined'}
    function create_if_block_8(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*variant*/ ctx[15] === 'filled' && create_if_block_10(ctx);
    	let if_block1 = !/*noLabel*/ ctx[16] && (/*label*/ ctx[17] != null || /*$$slots*/ ctx[42].label) && create_if_block_9(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*variant*/ ctx[15] === 'filled') {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_10(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!/*noLabel*/ ctx[16] && (/*label*/ ctx[17] != null || /*$$slots*/ ctx[42].label)) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*noLabel, label*/ 196608 | dirty[1] & /*$$slots*/ 2048) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_9(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(62:4) {#if !textarea && variant !== 'outlined'}",
    		ctx
    	});

    	return block;
    }

    // (63:6) {#if variant === 'filled'}
    function create_if_block_10(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "mdc-text-field__ripple");
    			add_location(span, file$b, 63, 8, 2241);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(63:6) {#if variant === 'filled'}",
    		ctx
    	});

    	return block;
    }

    // (66:6) {#if !noLabel && (label != null || $$slots.label)}
    function create_if_block_9(ctx) {
    	let floatinglabel;
    	let current;

    	const floatinglabel_spread_levels = [
    		{
    			floatAbove: /*focused*/ ctx[28] || /*value*/ ctx[0] != null && /*value*/ ctx[0] !== ''
    		},
    		{ required: /*required*/ ctx[13] },
    		{ wrapped: true },
    		prefixFilter(/*$$restProps*/ ctx[41], 'label$')
    	];

    	let floatinglabel_props = {
    		$$slots: { default: [create_default_slot_7] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < floatinglabel_spread_levels.length; i += 1) {
    		floatinglabel_props = assign(floatinglabel_props, floatinglabel_spread_levels[i]);
    	}

    	floatinglabel = new FloatingLabel({
    			props: floatinglabel_props,
    			$$inline: true
    		});

    	/*floatinglabel_binding*/ ctx[52](floatinglabel);

    	const block = {
    		c: function create() {
    			create_component(floatinglabel.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(floatinglabel, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const floatinglabel_changes = (dirty[0] & /*focused, value, required*/ 268443649 | dirty[1] & /*$$restProps*/ 1024)
    			? get_spread_update(floatinglabel_spread_levels, [
    					dirty[0] & /*focused, value*/ 268435457 && {
    						floatAbove: /*focused*/ ctx[28] || /*value*/ ctx[0] != null && /*value*/ ctx[0] !== ''
    					},
    					dirty[0] & /*required*/ 8192 && { required: /*required*/ ctx[13] },
    					floatinglabel_spread_levels[2],
    					dirty[1] & /*$$restProps*/ 1024 && get_spread_object(prefixFilter(/*$$restProps*/ ctx[41], 'label$'))
    				])
    			: {};

    			if (dirty[0] & /*label*/ 131072 | dirty[2] & /*$$scope*/ 268435456) {
    				floatinglabel_changes.$$scope = { dirty, ctx };
    			}

    			floatinglabel.$set(floatinglabel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(floatinglabel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(floatinglabel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*floatinglabel_binding*/ ctx[52](null);
    			destroy_component(floatinglabel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(66:6) {#if !noLabel && (label != null || $$slots.label)}",
    		ctx
    	});

    	return block;
    }

    // (67:8) <FloatingLabel           bind:this={floatingLabel}           floatAbove={focused || (value != null && value !== '')}           {required}           wrapped           {...prefixFilter($$restProps, 'label$')}           >
    function create_default_slot_7(ctx) {
    	let t_value = (/*label*/ ctx[17] == null ? '' : /*label*/ ctx[17]) + "";
    	let t;
    	let current;
    	const label_slot_template = /*#slots*/ ctx[51].label;
    	const label_slot = create_slot(label_slot_template, ctx, /*$$scope*/ ctx[90], get_label_slot_context);

    	const block = {
    		c: function create() {
    			t = text(t_value);
    			if (label_slot) label_slot.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);

    			if (label_slot) {
    				label_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*label*/ 131072) && t_value !== (t_value = (/*label*/ ctx[17] == null ? '' : /*label*/ ctx[17]) + "")) set_data_dev(t, t_value);

    			if (label_slot) {
    				if (label_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						label_slot,
    						label_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(label_slot_template, /*$$scope*/ ctx[90], dirty, get_label_slot_changes),
    						get_label_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (label_slot) label_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(67:8) <FloatingLabel           bind:this={floatingLabel}           floatAbove={focused || (value != null && value !== '')}           {required}           wrapped           {...prefixFilter($$restProps, 'label$')}           >",
    		ctx
    	});

    	return block;
    }

    // (77:4) {#if textarea || variant === 'outlined'}
    function create_if_block_6(ctx) {
    	let notchedoutline;
    	let current;

    	const notchedoutline_spread_levels = [
    		{
    			noLabel: /*noLabel*/ ctx[16] || /*label*/ ctx[17] == null && !/*$$slots*/ ctx[42].label
    		},
    		prefixFilter(/*$$restProps*/ ctx[41], 'outline$')
    	];

    	let notchedoutline_props = {
    		$$slots: { default: [create_default_slot_5] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < notchedoutline_spread_levels.length; i += 1) {
    		notchedoutline_props = assign(notchedoutline_props, notchedoutline_spread_levels[i]);
    	}

    	notchedoutline = new NotchedOutline({
    			props: notchedoutline_props,
    			$$inline: true
    		});

    	/*notchedoutline_binding*/ ctx[54](notchedoutline);

    	const block = {
    		c: function create() {
    			create_component(notchedoutline.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(notchedoutline, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const notchedoutline_changes = (dirty[0] & /*noLabel, label*/ 196608 | dirty[1] & /*$$slots, $$restProps*/ 3072)
    			? get_spread_update(notchedoutline_spread_levels, [
    					dirty[0] & /*noLabel, label*/ 196608 | dirty[1] & /*$$slots*/ 2048 && {
    						noLabel: /*noLabel*/ ctx[16] || /*label*/ ctx[17] == null && !/*$$slots*/ ctx[42].label
    					},
    					dirty[1] & /*$$restProps*/ 1024 && get_spread_object(prefixFilter(/*$$restProps*/ ctx[41], 'outline$'))
    				])
    			: {};

    			if (dirty[0] & /*focused, value, required, floatingLabel, label, noLabel*/ 268640289 | dirty[1] & /*$$restProps, $$slots*/ 3072 | dirty[2] & /*$$scope*/ 268435456) {
    				notchedoutline_changes.$$scope = { dirty, ctx };
    			}

    			notchedoutline.$set(notchedoutline_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notchedoutline.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notchedoutline.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*notchedoutline_binding*/ ctx[54](null);
    			destroy_component(notchedoutline, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(77:4) {#if textarea || variant === 'outlined'}",
    		ctx
    	});

    	return block;
    }

    // (83:8) {#if !noLabel && (label != null || $$slots.label)}
    function create_if_block_7(ctx) {
    	let floatinglabel;
    	let current;

    	const floatinglabel_spread_levels = [
    		{
    			floatAbove: /*focused*/ ctx[28] || /*value*/ ctx[0] != null && /*value*/ ctx[0] !== ''
    		},
    		{ required: /*required*/ ctx[13] },
    		{ wrapped: true },
    		prefixFilter(/*$$restProps*/ ctx[41], 'label$')
    	];

    	let floatinglabel_props = {
    		$$slots: { default: [create_default_slot_6] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < floatinglabel_spread_levels.length; i += 1) {
    		floatinglabel_props = assign(floatinglabel_props, floatinglabel_spread_levels[i]);
    	}

    	floatinglabel = new FloatingLabel({
    			props: floatinglabel_props,
    			$$inline: true
    		});

    	/*floatinglabel_binding_1*/ ctx[53](floatinglabel);

    	const block = {
    		c: function create() {
    			create_component(floatinglabel.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(floatinglabel, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const floatinglabel_changes = (dirty[0] & /*focused, value, required*/ 268443649 | dirty[1] & /*$$restProps*/ 1024)
    			? get_spread_update(floatinglabel_spread_levels, [
    					dirty[0] & /*focused, value*/ 268435457 && {
    						floatAbove: /*focused*/ ctx[28] || /*value*/ ctx[0] != null && /*value*/ ctx[0] !== ''
    					},
    					dirty[0] & /*required*/ 8192 && { required: /*required*/ ctx[13] },
    					floatinglabel_spread_levels[2],
    					dirty[1] & /*$$restProps*/ 1024 && get_spread_object(prefixFilter(/*$$restProps*/ ctx[41], 'label$'))
    				])
    			: {};

    			if (dirty[0] & /*label*/ 131072 | dirty[2] & /*$$scope*/ 268435456) {
    				floatinglabel_changes.$$scope = { dirty, ctx };
    			}

    			floatinglabel.$set(floatinglabel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(floatinglabel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(floatinglabel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*floatinglabel_binding_1*/ ctx[53](null);
    			destroy_component(floatinglabel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(83:8) {#if !noLabel && (label != null || $$slots.label)}",
    		ctx
    	});

    	return block;
    }

    // (84:10) <FloatingLabel             bind:this={floatingLabel}             floatAbove={focused || (value != null && value !== '')}             {required}             wrapped             {...prefixFilter($$restProps, 'label$')}             >
    function create_default_slot_6(ctx) {
    	let t_value = (/*label*/ ctx[17] == null ? '' : /*label*/ ctx[17]) + "";
    	let t;
    	let current;
    	const label_slot_template = /*#slots*/ ctx[51].label;
    	const label_slot = create_slot(label_slot_template, ctx, /*$$scope*/ ctx[90], get_label_slot_context_1);

    	const block = {
    		c: function create() {
    			t = text(t_value);
    			if (label_slot) label_slot.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);

    			if (label_slot) {
    				label_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*label*/ 131072) && t_value !== (t_value = (/*label*/ ctx[17] == null ? '' : /*label*/ ctx[17]) + "")) set_data_dev(t, t_value);

    			if (label_slot) {
    				if (label_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						label_slot,
    						label_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(label_slot_template, /*$$scope*/ ctx[90], dirty, get_label_slot_changes_1),
    						get_label_slot_context_1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (label_slot) label_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(84:10) <FloatingLabel             bind:this={floatingLabel}             floatAbove={focused || (value != null && value !== '')}             {required}             wrapped             {...prefixFilter($$restProps, 'label$')}             >",
    		ctx
    	});

    	return block;
    }

    // (78:6) <NotchedOutline         bind:this={notchedOutline}         noLabel={noLabel || (label == null && !$$slots.label)}         {...prefixFilter($$restProps, 'outline$')}       >
    function create_default_slot_5(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = !/*noLabel*/ ctx[16] && (/*label*/ ctx[17] != null || /*$$slots*/ ctx[42].label) && create_if_block_7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!/*noLabel*/ ctx[16] && (/*label*/ ctx[17] != null || /*$$slots*/ ctx[42].label)) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*noLabel, label*/ 196608 | dirty[1] & /*$$slots*/ 2048) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(78:6) <NotchedOutline         bind:this={notchedOutline}         noLabel={noLabel || (label == null && !$$slots.label)}         {...prefixFilter($$restProps, 'outline$')}       >",
    		ctx
    	});

    	return block;
    }

    // (95:4) <ContextFragment key="SMUI:textfield:icon:leading" value={true}>
    function create_default_slot_4$2(ctx) {
    	let current;
    	const leadingIcon_slot_template = /*#slots*/ ctx[51].leadingIcon;
    	const leadingIcon_slot = create_slot(leadingIcon_slot_template, ctx, /*$$scope*/ ctx[90], get_leadingIcon_slot_context);

    	const block = {
    		c: function create() {
    			if (leadingIcon_slot) leadingIcon_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (leadingIcon_slot) {
    				leadingIcon_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (leadingIcon_slot) {
    				if (leadingIcon_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						leadingIcon_slot,
    						leadingIcon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(leadingIcon_slot_template, /*$$scope*/ ctx[90], dirty, get_leadingIcon_slot_changes),
    						get_leadingIcon_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(leadingIcon_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(leadingIcon_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (leadingIcon_slot) leadingIcon_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(95:4) <ContextFragment key=\\\"SMUI:textfield:icon:leading\\\" value={true}>",
    		ctx
    	});

    	return block;
    }

    // (124:4) {:else}
    function create_else_block$1(ctx) {
    	let t0;
    	let t1;
    	let input_1;
    	let updating_value;
    	let updating_files;
    	let updating_dirty;
    	let updating_invalid;
    	let t2;
    	let t3;
    	let current;
    	const prefix_slot_template = /*#slots*/ ctx[51].prefix;
    	const prefix_slot = create_slot(prefix_slot_template, ctx, /*$$scope*/ ctx[90], get_prefix_slot_context);
    	let if_block0 = /*prefix*/ ctx[20] != null && create_if_block_5(ctx);

    	const input_1_spread_levels = [
    		{ type: /*type*/ ctx[18] },
    		{ disabled: /*disabled*/ ctx[12] },
    		{ required: /*required*/ ctx[13] },
    		{ updateInvalid: /*updateInvalid*/ ctx[19] },
    		{ "aria-controls": /*helperId*/ ctx[27] },
    		{ "aria-describedby": /*helperId*/ ctx[27] },
    		/*noLabel*/ ctx[16] && /*label*/ ctx[17] != null
    		? { placeholder: /*label*/ ctx[17] }
    		: {},
    		prefixFilter(/*$$restProps*/ ctx[41], 'input$')
    	];

    	function input_1_value_binding(value) {
    		/*input_1_value_binding*/ ctx[64](value);
    	}

    	function input_1_files_binding(value) {
    		/*input_1_files_binding*/ ctx[65](value);
    	}

    	function input_1_dirty_binding(value) {
    		/*input_1_dirty_binding*/ ctx[66](value);
    	}

    	function input_1_invalid_binding(value) {
    		/*input_1_invalid_binding*/ ctx[67](value);
    	}

    	let input_1_props = {};

    	for (let i = 0; i < input_1_spread_levels.length; i += 1) {
    		input_1_props = assign(input_1_props, input_1_spread_levels[i]);
    	}

    	if (/*value*/ ctx[0] !== void 0) {
    		input_1_props.value = /*value*/ ctx[0];
    	}

    	if (/*files*/ ctx[3] !== void 0) {
    		input_1_props.files = /*files*/ ctx[3];
    	}

    	if (/*dirty*/ ctx[4] !== void 0) {
    		input_1_props.dirty = /*dirty*/ ctx[4];
    	}

    	if (/*invalid*/ ctx[1] !== void 0) {
    		input_1_props.invalid = /*invalid*/ ctx[1];
    	}

    	input_1 = new Input({ props: input_1_props, $$inline: true });
    	/*input_1_binding*/ ctx[63](input_1);
    	binding_callbacks.push(() => bind(input_1, 'value', input_1_value_binding));
    	binding_callbacks.push(() => bind(input_1, 'files', input_1_files_binding));
    	binding_callbacks.push(() => bind(input_1, 'dirty', input_1_dirty_binding));
    	binding_callbacks.push(() => bind(input_1, 'invalid', input_1_invalid_binding));
    	input_1.$on("blur", /*blur_handler_2*/ ctx[68]);
    	input_1.$on("focus", /*focus_handler_2*/ ctx[69]);
    	input_1.$on("blur", /*blur_handler_3*/ ctx[70]);
    	input_1.$on("focus", /*focus_handler_3*/ ctx[71]);
    	let if_block1 = /*suffix*/ ctx[21] != null && create_if_block_4(ctx);
    	const suffix_slot_template = /*#slots*/ ctx[51].suffix;
    	const suffix_slot = create_slot(suffix_slot_template, ctx, /*$$scope*/ ctx[90], get_suffix_slot_context);

    	const block = {
    		c: function create() {
    			if (prefix_slot) prefix_slot.c();
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			create_component(input_1.$$.fragment);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (suffix_slot) suffix_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (prefix_slot) {
    				prefix_slot.m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(input_1, target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t3, anchor);

    			if (suffix_slot) {
    				suffix_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (prefix_slot) {
    				if (prefix_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						prefix_slot,
    						prefix_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(prefix_slot_template, /*$$scope*/ ctx[90], dirty, get_prefix_slot_changes),
    						get_prefix_slot_context
    					);
    				}
    			}

    			if (/*prefix*/ ctx[20] != null) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*prefix*/ 1048576) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const input_1_changes = (dirty[0] & /*type, disabled, required, updateInvalid, helperId, noLabel, label*/ 135213056 | dirty[1] & /*$$restProps*/ 1024)
    			? get_spread_update(input_1_spread_levels, [
    					dirty[0] & /*type*/ 262144 && { type: /*type*/ ctx[18] },
    					dirty[0] & /*disabled*/ 4096 && { disabled: /*disabled*/ ctx[12] },
    					dirty[0] & /*required*/ 8192 && { required: /*required*/ ctx[13] },
    					dirty[0] & /*updateInvalid*/ 524288 && { updateInvalid: /*updateInvalid*/ ctx[19] },
    					dirty[0] & /*helperId*/ 134217728 && { "aria-controls": /*helperId*/ ctx[27] },
    					dirty[0] & /*helperId*/ 134217728 && { "aria-describedby": /*helperId*/ ctx[27] },
    					dirty[0] & /*noLabel, label*/ 196608 && get_spread_object(/*noLabel*/ ctx[16] && /*label*/ ctx[17] != null
    					? { placeholder: /*label*/ ctx[17] }
    					: {}),
    					dirty[1] & /*$$restProps*/ 1024 && get_spread_object(prefixFilter(/*$$restProps*/ ctx[41], 'input$'))
    				])
    			: {};

    			if (!updating_value && dirty[0] & /*value*/ 1) {
    				updating_value = true;
    				input_1_changes.value = /*value*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			if (!updating_files && dirty[0] & /*files*/ 8) {
    				updating_files = true;
    				input_1_changes.files = /*files*/ ctx[3];
    				add_flush_callback(() => updating_files = false);
    			}

    			if (!updating_dirty && dirty[0] & /*dirty*/ 16) {
    				updating_dirty = true;
    				input_1_changes.dirty = /*dirty*/ ctx[4];
    				add_flush_callback(() => updating_dirty = false);
    			}

    			if (!updating_invalid && dirty[0] & /*invalid*/ 2) {
    				updating_invalid = true;
    				input_1_changes.invalid = /*invalid*/ ctx[1];
    				add_flush_callback(() => updating_invalid = false);
    			}

    			input_1.$set(input_1_changes);

    			if (/*suffix*/ ctx[21] != null) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*suffix*/ 2097152) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_4(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t3.parentNode, t3);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (suffix_slot) {
    				if (suffix_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						suffix_slot,
    						suffix_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(suffix_slot_template, /*$$scope*/ ctx[90], dirty, get_suffix_slot_changes),
    						get_suffix_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prefix_slot, local);
    			transition_in(if_block0);
    			transition_in(input_1.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(suffix_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prefix_slot, local);
    			transition_out(if_block0);
    			transition_out(input_1.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(suffix_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (prefix_slot) prefix_slot.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			/*input_1_binding*/ ctx[63](null);
    			destroy_component(input_1, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (suffix_slot) suffix_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(124:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (99:4) {#if textarea && typeof value === 'string'}
    function create_if_block_3(ctx) {
    	let span;
    	let textarea_1;
    	let updating_value;
    	let updating_dirty;
    	let updating_invalid;
    	let t;
    	let span_class_value;
    	let current;

    	const textarea_1_spread_levels = [
    		{ disabled: /*disabled*/ ctx[12] },
    		{ required: /*required*/ ctx[13] },
    		{ updateInvalid: /*updateInvalid*/ ctx[19] },
    		{ "aria-controls": /*helperId*/ ctx[27] },
    		{ "aria-describedby": /*helperId*/ ctx[27] },
    		prefixFilter(/*$$restProps*/ ctx[41], 'input$')
    	];

    	function textarea_1_value_binding(value) {
    		/*textarea_1_value_binding*/ ctx[56](value);
    	}

    	function textarea_1_dirty_binding(value) {
    		/*textarea_1_dirty_binding*/ ctx[57](value);
    	}

    	function textarea_1_invalid_binding(value) {
    		/*textarea_1_invalid_binding*/ ctx[58](value);
    	}

    	let textarea_1_props = {};

    	for (let i = 0; i < textarea_1_spread_levels.length; i += 1) {
    		textarea_1_props = assign(textarea_1_props, textarea_1_spread_levels[i]);
    	}

    	if (/*value*/ ctx[0] !== void 0) {
    		textarea_1_props.value = /*value*/ ctx[0];
    	}

    	if (/*dirty*/ ctx[4] !== void 0) {
    		textarea_1_props.dirty = /*dirty*/ ctx[4];
    	}

    	if (/*invalid*/ ctx[1] !== void 0) {
    		textarea_1_props.invalid = /*invalid*/ ctx[1];
    	}

    	textarea_1 = new Textarea({ props: textarea_1_props, $$inline: true });
    	/*textarea_1_binding*/ ctx[55](textarea_1);
    	binding_callbacks.push(() => bind(textarea_1, 'value', textarea_1_value_binding));
    	binding_callbacks.push(() => bind(textarea_1, 'dirty', textarea_1_dirty_binding));
    	binding_callbacks.push(() => bind(textarea_1, 'invalid', textarea_1_invalid_binding));
    	textarea_1.$on("blur", /*blur_handler*/ ctx[59]);
    	textarea_1.$on("focus", /*focus_handler*/ ctx[60]);
    	textarea_1.$on("blur", /*blur_handler_1*/ ctx[61]);
    	textarea_1.$on("focus", /*focus_handler_1*/ ctx[62]);
    	const internalCounter_slot_template = /*#slots*/ ctx[51].internalCounter;
    	const internalCounter_slot = create_slot(internalCounter_slot_template, ctx, /*$$scope*/ ctx[90], get_internalCounter_slot_context);

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(textarea_1.$$.fragment);
    			t = space();
    			if (internalCounter_slot) internalCounter_slot.c();

    			attr_dev(span, "class", span_class_value = classMap({
    				'mdc-text-field__resizer': !('input$resizable' in /*$$restProps*/ ctx[41]) || /*$$restProps*/ ctx[41].input$resizable
    			}));

    			add_location(span, file$b, 99, 6, 3514);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(textarea_1, span, null);
    			append_dev(span, t);

    			if (internalCounter_slot) {
    				internalCounter_slot.m(span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textarea_1_changes = (dirty[0] & /*disabled, required, updateInvalid, helperId*/ 134754304 | dirty[1] & /*$$restProps*/ 1024)
    			? get_spread_update(textarea_1_spread_levels, [
    					dirty[0] & /*disabled*/ 4096 && { disabled: /*disabled*/ ctx[12] },
    					dirty[0] & /*required*/ 8192 && { required: /*required*/ ctx[13] },
    					dirty[0] & /*updateInvalid*/ 524288 && { updateInvalid: /*updateInvalid*/ ctx[19] },
    					dirty[0] & /*helperId*/ 134217728 && { "aria-controls": /*helperId*/ ctx[27] },
    					dirty[0] & /*helperId*/ 134217728 && { "aria-describedby": /*helperId*/ ctx[27] },
    					dirty[1] & /*$$restProps*/ 1024 && get_spread_object(prefixFilter(/*$$restProps*/ ctx[41], 'input$'))
    				])
    			: {};

    			if (!updating_value && dirty[0] & /*value*/ 1) {
    				updating_value = true;
    				textarea_1_changes.value = /*value*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			if (!updating_dirty && dirty[0] & /*dirty*/ 16) {
    				updating_dirty = true;
    				textarea_1_changes.dirty = /*dirty*/ ctx[4];
    				add_flush_callback(() => updating_dirty = false);
    			}

    			if (!updating_invalid && dirty[0] & /*invalid*/ 2) {
    				updating_invalid = true;
    				textarea_1_changes.invalid = /*invalid*/ ctx[1];
    				add_flush_callback(() => updating_invalid = false);
    			}

    			textarea_1.$set(textarea_1_changes);

    			if (internalCounter_slot) {
    				if (internalCounter_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						internalCounter_slot,
    						internalCounter_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(internalCounter_slot_template, /*$$scope*/ ctx[90], dirty, get_internalCounter_slot_changes),
    						get_internalCounter_slot_context
    					);
    				}
    			}

    			if (!current || dirty[1] & /*$$restProps*/ 1024 && span_class_value !== (span_class_value = classMap({
    				'mdc-text-field__resizer': !('input$resizable' in /*$$restProps*/ ctx[41]) || /*$$restProps*/ ctx[41].input$resizable
    			}))) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textarea_1.$$.fragment, local);
    			transition_in(internalCounter_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textarea_1.$$.fragment, local);
    			transition_out(internalCounter_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			/*textarea_1_binding*/ ctx[55](null);
    			destroy_component(textarea_1);
    			if (internalCounter_slot) internalCounter_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(99:4) {#if textarea && typeof value === 'string'}",
    		ctx
    	});

    	return block;
    }

    // (126:6) {#if prefix != null}
    function create_if_block_5(ctx) {
    	let prefix_1;
    	let current;

    	prefix_1 = new Prefix({
    			props: {
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(prefix_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(prefix_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const prefix_1_changes = {};

    			if (dirty[0] & /*prefix*/ 1048576 | dirty[2] & /*$$scope*/ 268435456) {
    				prefix_1_changes.$$scope = { dirty, ctx };
    			}

    			prefix_1.$set(prefix_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prefix_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prefix_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(prefix_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(126:6) {#if prefix != null}",
    		ctx
    	});

    	return block;
    }

    // (127:8) <Prefix>
    function create_default_slot_3$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*prefix*/ ctx[20]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*prefix*/ 1048576) set_data_dev(t, /*prefix*/ ctx[20]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(127:8) <Prefix>",
    		ctx
    	});

    	return block;
    }

    // (148:6) {#if suffix != null}
    function create_if_block_4(ctx) {
    	let suffix_1;
    	let current;

    	suffix_1 = new Suffix({
    			props: {
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(suffix_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(suffix_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const suffix_1_changes = {};

    			if (dirty[0] & /*suffix*/ 2097152 | dirty[2] & /*$$scope*/ 268435456) {
    				suffix_1_changes.$$scope = { dirty, ctx };
    			}

    			suffix_1.$set(suffix_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(suffix_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(suffix_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(suffix_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(148:6) {#if suffix != null}",
    		ctx
    	});

    	return block;
    }

    // (149:8) <Suffix>
    function create_default_slot_2$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*suffix*/ ctx[21]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*suffix*/ 2097152) set_data_dev(t, /*suffix*/ ctx[21]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(149:8) <Suffix>",
    		ctx
    	});

    	return block;
    }

    // (153:4) <ContextFragment key="SMUI:textfield:icon:leading" value={false}>
    function create_default_slot_1$3(ctx) {
    	let current;
    	const trailingIcon_slot_template = /*#slots*/ ctx[51].trailingIcon;
    	const trailingIcon_slot = create_slot(trailingIcon_slot_template, ctx, /*$$scope*/ ctx[90], get_trailingIcon_slot_context);

    	const block = {
    		c: function create() {
    			if (trailingIcon_slot) trailingIcon_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (trailingIcon_slot) {
    				trailingIcon_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (trailingIcon_slot) {
    				if (trailingIcon_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						trailingIcon_slot,
    						trailingIcon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(trailingIcon_slot_template, /*$$scope*/ ctx[90], dirty, get_trailingIcon_slot_changes),
    						get_trailingIcon_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(trailingIcon_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(trailingIcon_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (trailingIcon_slot) trailingIcon_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(153:4) <ContextFragment key=\\\"SMUI:textfield:icon:leading\\\" value={false}>",
    		ctx
    	});

    	return block;
    }

    // (156:4) {#if !textarea && variant !== 'outlined' && ripple}
    function create_if_block_2(ctx) {
    	let lineripple;
    	let current;
    	const lineripple_spread_levels = [prefixFilter(/*$$restProps*/ ctx[41], 'ripple$')];
    	let lineripple_props = {};

    	for (let i = 0; i < lineripple_spread_levels.length; i += 1) {
    		lineripple_props = assign(lineripple_props, lineripple_spread_levels[i]);
    	}

    	lineripple = new LineRipple({ props: lineripple_props, $$inline: true });
    	/*lineripple_binding*/ ctx[72](lineripple);

    	const block = {
    		c: function create() {
    			create_component(lineripple.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(lineripple, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const lineripple_changes = (dirty[1] & /*$$restProps*/ 1024)
    			? get_spread_update(lineripple_spread_levels, [get_spread_object(prefixFilter(/*$$restProps*/ ctx[41], 'ripple$'))])
    			: {};

    			lineripple.$set(lineripple_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lineripple.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lineripple.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*lineripple_binding*/ ctx[72](null);
    			destroy_component(lineripple, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(156:4) {#if !textarea && variant !== 'outlined' && ripple}",
    		ctx
    	});

    	return block;
    }

    // (217:0) {#if $$slots.helper}
    function create_if_block$5(ctx) {
    	let helperline;
    	let current;
    	const helperline_spread_levels = [prefixFilter(/*$$restProps*/ ctx[41], 'helperLine$')];

    	let helperline_props = {
    		$$slots: { default: [create_default_slot$6] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < helperline_spread_levels.length; i += 1) {
    		helperline_props = assign(helperline_props, helperline_spread_levels[i]);
    	}

    	helperline = new HelperLine({ props: helperline_props, $$inline: true });
    	helperline.$on("SMUITextfieldHelperText:id", /*SMUITextfieldHelperText_id_handler*/ ctx[85]);
    	helperline.$on("SMUITextfieldHelperText:mount", /*SMUITextfieldHelperText_mount_handler*/ ctx[86]);
    	helperline.$on("SMUITextfieldHelperText:unmount", /*SMUITextfieldHelperText_unmount_handler*/ ctx[87]);
    	helperline.$on("SMUITextfieldCharacterCounter:mount", /*SMUITextfieldCharacterCounter_mount_handler_1*/ ctx[88]);
    	helperline.$on("SMUITextfieldCharacterCounter:unmount", /*SMUITextfieldCharacterCounter_unmount_handler_1*/ ctx[89]);

    	const block = {
    		c: function create() {
    			create_component(helperline.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(helperline, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const helperline_changes = (dirty[1] & /*$$restProps*/ 1024)
    			? get_spread_update(helperline_spread_levels, [get_spread_object(prefixFilter(/*$$restProps*/ ctx[41], 'helperLine$'))])
    			: {};

    			if (dirty[2] & /*$$scope*/ 268435456) {
    				helperline_changes.$$scope = { dirty, ctx };
    			}

    			helperline.$set(helperline_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(helperline.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(helperline.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(helperline, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(217:0) {#if $$slots.helper}",
    		ctx
    	});

    	return block;
    }

    // (218:2) <HelperLine     on:SMUITextfieldHelperText:id={(event) => (helperId = event.detail)}     on:SMUITextfieldHelperText:mount={(event) => (helperText = event.detail)}     on:SMUITextfieldHelperText:unmount={() => {       helperId = undefined;       helperText = undefined;     }}     on:SMUITextfieldCharacterCounter:mount={(event) =>       (characterCounter = event.detail)}     on:SMUITextfieldCharacterCounter:unmount={() =>       (characterCounter = undefined)}     {...prefixFilter($$restProps, 'helperLine$')}     >
    function create_default_slot$6(ctx) {
    	let current;
    	const helper_slot_template = /*#slots*/ ctx[51].helper;
    	const helper_slot = create_slot(helper_slot_template, ctx, /*$$scope*/ ctx[90], get_helper_slot_context);

    	const block = {
    		c: function create() {
    			if (helper_slot) helper_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (helper_slot) {
    				helper_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (helper_slot) {
    				if (helper_slot.p && (!current || dirty[2] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						helper_slot,
    						helper_slot_template,
    						ctx,
    						/*$$scope*/ ctx[90],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[90])
    						: get_slot_changes(helper_slot_template, /*$$scope*/ ctx[90], dirty, get_helper_slot_changes),
    						get_helper_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(helper_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(helper_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (helper_slot) helper_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(218:2) <HelperLine     on:SMUITextfieldHelperText:id={(event) => (helperId = event.detail)}     on:SMUITextfieldHelperText:mount={(event) => (helperText = event.detail)}     on:SMUITextfieldHelperText:unmount={() => {       helperId = undefined;       helperText = undefined;     }}     on:SMUITextfieldCharacterCounter:mount={(event) =>       (characterCounter = event.detail)}     on:SMUITextfieldCharacterCounter:unmount={() =>       (characterCounter = undefined)}     {...prefixFilter($$restProps, 'helperLine$')}     >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let current_block_type_index;
    	let if_block0;
    	let t;
    	let if_block1_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$2, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*valued*/ ctx[36]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*$$slots*/ ctx[42].helper && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if_block0.p(ctx, dirty);

    			if (/*$$slots*/ ctx[42].helper) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[1] & /*$$slots*/ 2048) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$5(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$4 = ([name, value]) => `${name}: ${value};`;
    const func_1 = ([name, value]) => `${name}: ${value};`;

    function instance_1$4($$self, $$props, $$invalidate) {
    	let inputElement;

    	const omit_props_names = [
    		"use","class","style","ripple","disabled","required","textarea","variant","noLabel","label","type","value","files","invalid","updateInvalid","dirty","prefix","suffix","validateOnValueChange","useNativeValidation","withLeadingIcon","withTrailingIcon","input","floatingLabel","lineRipple","notchedOutline","focus","blur","layout","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;

    	validate_slots('Textfield', slots, [
    		'label','leadingIcon','default','internalCounter','prefix','suffix','trailingIcon','ripple','helper'
    	]);

    	const $$slots = compute_slots(slots);
    	const { applyPassive } = events;
    	const forwardEvents = forwardEventsBuilder(get_current_component());

    	let uninitializedValue = () => {
    		
    	};

    	function isUninitializedValue(value) {
    		return value === uninitializedValue;
    	}

    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
    	let { ripple = true } = $$props;
    	let { disabled = false } = $$props;
    	let { required = false } = $$props;
    	let { textarea = false } = $$props;
    	let { variant = textarea ? 'outlined' : 'standard' } = $$props;
    	let { noLabel = false } = $$props;
    	let { label = undefined } = $$props;
    	let { type = 'text' } = $$props;

    	let { value = $$restProps.input$emptyValueUndefined
    	? undefined
    	: uninitializedValue } = $$props;

    	let { files = uninitializedValue } = $$props;
    	const valued = !isUninitializedValue(value) || !isUninitializedValue(files);

    	if (isUninitializedValue(value)) {
    		value = undefined;
    	}

    	if (isUninitializedValue(files)) {
    		files = null;
    	}

    	let { invalid = uninitializedValue } = $$props;
    	let { updateInvalid = isUninitializedValue(invalid) } = $$props;

    	if (isUninitializedValue(invalid)) {
    		invalid = false;
    	}

    	let { dirty = false } = $$props;
    	let { prefix = undefined } = $$props;
    	let { suffix = undefined } = $$props;
    	let { validateOnValueChange = updateInvalid } = $$props;
    	let { useNativeValidation = updateInvalid } = $$props;
    	let { withLeadingIcon = uninitializedValue } = $$props;
    	let { withTrailingIcon = uninitializedValue } = $$props;
    	let { input = undefined } = $$props;
    	let { floatingLabel = undefined } = $$props;
    	let { lineRipple = undefined } = $$props;
    	let { notchedOutline = undefined } = $$props;
    	let element;
    	let instance;
    	let internalClasses = {};
    	let internalStyles = {};
    	let helperId = undefined;
    	let focused = false;
    	let addLayoutListener = getContext('SMUI:addLayoutListener');
    	let removeLayoutListener;
    	let initPromiseResolve;
    	let initPromise = new Promise(resolve => initPromiseResolve = resolve);

    	// These are instances, not accessors.
    	let leadingIcon = undefined;

    	let trailingIcon = undefined;
    	let helperText = undefined;
    	let characterCounter = undefined;

    	// React to changes of value from outside component.
    	let previousValue = value;

    	if (addLayoutListener) {
    		removeLayoutListener = addLayoutListener(layout);
    	}

    	onMount(() => {
    		$$invalidate(49, instance = new MDCTextFieldFoundation({
    				// getRootAdapterMethods_
    				addClass,
    				removeClass,
    				hasClass,
    				registerTextFieldInteractionHandler: (evtType, handler) => getElement().addEventListener(evtType, handler),
    				deregisterTextFieldInteractionHandler: (evtType, handler) => getElement().removeEventListener(evtType, handler),
    				registerValidationAttributeChangeHandler: handler => {
    					const getAttributesList = mutationsList => {
    						return mutationsList.map(mutation => mutation.attributeName).filter(attributeName => attributeName);
    					};

    					const observer = new MutationObserver(mutationsList => {
    							if (useNativeValidation) {
    								handler(getAttributesList(mutationsList));
    							}
    						});

    					const config = { attributes: true };

    					if (input) {
    						observer.observe(input.getElement(), config);
    					}

    					return observer;
    				},
    				deregisterValidationAttributeChangeHandler: observer => {
    					observer.disconnect();
    				},
    				// getInputAdapterMethods_
    				getNativeInput: () => {
    					var _a;

    					return (_a = input === null || input === void 0
    					? void 0
    					: input.getElement()) !== null && _a !== void 0
    					? _a
    					: null;
    				},
    				setInputAttr: (name, value) => {
    					input === null || input === void 0
    					? void 0
    					: input.addAttr(name, value);
    				},
    				removeInputAttr: name => {
    					input === null || input === void 0
    					? void 0
    					: input.removeAttr(name);
    				},
    				isFocused: () => document.activeElement === (input === null || input === void 0
    				? void 0
    				: input.getElement()),
    				registerInputInteractionHandler: (evtType, handler) => {
    					input === null || input === void 0
    					? void 0
    					: input.getElement().addEventListener(evtType, handler, applyPassive());
    				},
    				deregisterInputInteractionHandler: (evtType, handler) => {
    					input === null || input === void 0
    					? void 0
    					: input.getElement().removeEventListener(evtType, handler, applyPassive());
    				},
    				// getLabelAdapterMethods_
    				floatLabel: shouldFloat => floatingLabel && floatingLabel.float(shouldFloat),
    				getLabelWidth: () => floatingLabel ? floatingLabel.getWidth() : 0,
    				hasLabel: () => !!floatingLabel,
    				shakeLabel: shouldShake => floatingLabel && floatingLabel.shake(shouldShake),
    				setLabelRequired: isRequired => floatingLabel && floatingLabel.setRequired(isRequired),
    				// getLineRippleAdapterMethods_
    				activateLineRipple: () => lineRipple && lineRipple.activate(),
    				deactivateLineRipple: () => lineRipple && lineRipple.deactivate(),
    				setLineRippleTransformOrigin: normalizedX => lineRipple && lineRipple.setRippleCenter(normalizedX),
    				// getOutlineAdapterMethods_
    				closeOutline: () => notchedOutline && notchedOutline.closeNotch(),
    				hasOutline: () => !!notchedOutline,
    				notchOutline: labelWidth => notchedOutline && notchedOutline.notch(labelWidth)
    			},
    		{
    				get helperText() {
    					return helperText;
    				},
    				get characterCounter() {
    					return characterCounter;
    				},
    				get leadingIcon() {
    					return leadingIcon;
    				},
    				get trailingIcon() {
    					return trailingIcon;
    				}
    			}));

    		if (valued) {
    			if (input == null) {
    				throw new Error('SMUI Textfield initialized without Input component.');
    			}

    			instance.init();
    		} else {
    			tick().then(() => {
    				if (input == null) {
    					throw new Error('SMUI Textfield initialized without Input component.');
    				}

    				instance.init();
    			});
    		}

    		initPromiseResolve();

    		return () => {
    			instance.destroy();
    		};
    	});

    	onDestroy(() => {
    		if (removeLayoutListener) {
    			removeLayoutListener();
    		}
    	});

    	function hasClass(className) {
    		var _a;

    		return className in internalClasses
    		? (_a = internalClasses[className]) !== null && _a !== void 0
    			? _a
    			: null
    		: getElement().classList.contains(className);
    	}

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(25, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(25, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addStyle(name, value) {
    		if (internalStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete internalStyles[name];
    				$$invalidate(26, internalStyles);
    			} else {
    				$$invalidate(26, internalStyles[name] = value, internalStyles);
    			}
    		}
    	}

    	function focus() {
    		input === null || input === void 0
    		? void 0
    		: input.focus();
    	}

    	function blur() {
    		input === null || input === void 0
    		? void 0
    		: input.blur();
    	}

    	function layout() {
    		if (instance) {
    			const openNotch = instance.shouldFloat;
    			instance.notchOutline(openNotch);
    		}
    	}

    	function getElement() {
    		return element;
    	}

    	function floatinglabel_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			floatingLabel = $$value;
    			$$invalidate(5, floatingLabel);
    		});
    	}

    	function floatinglabel_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			floatingLabel = $$value;
    			$$invalidate(5, floatingLabel);
    		});
    	}

    	function notchedoutline_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			notchedOutline = $$value;
    			$$invalidate(7, notchedOutline);
    		});
    	}

    	function textarea_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(2, input);
    		});
    	}

    	function textarea_1_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(0, value);
    	}

    	function textarea_1_dirty_binding(value) {
    		dirty = value;
    		$$invalidate(4, dirty);
    	}

    	function textarea_1_invalid_binding(value) {
    		invalid = value;
    		(($$invalidate(1, invalid), $$invalidate(49, instance)), $$invalidate(19, updateInvalid));
    	}

    	const blur_handler = () => $$invalidate(28, focused = false);
    	const focus_handler = () => $$invalidate(28, focused = true);
    	const blur_handler_1 = event => dispatch(element, 'blur', event);
    	const focus_handler_1 = event => dispatch(element, 'focus', event);

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(2, input);
    		});
    	}

    	function input_1_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(0, value);
    	}

    	function input_1_files_binding(value) {
    		files = value;
    		$$invalidate(3, files);
    	}

    	function input_1_dirty_binding(value) {
    		dirty = value;
    		$$invalidate(4, dirty);
    	}

    	function input_1_invalid_binding(value) {
    		invalid = value;
    		(($$invalidate(1, invalid), $$invalidate(49, instance)), $$invalidate(19, updateInvalid));
    	}

    	const blur_handler_2 = () => $$invalidate(28, focused = false);
    	const focus_handler_2 = () => $$invalidate(28, focused = true);
    	const blur_handler_3 = event => dispatch(element, 'blur', event);
    	const focus_handler_3 = event => dispatch(element, 'focus', event);

    	function lineripple_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			lineRipple = $$value;
    			$$invalidate(6, lineRipple);
    		});
    	}

    	function label_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(24, element);
    		});
    	}

    	const SMUITextfieldLeadingIcon_mount_handler = event => $$invalidate(29, leadingIcon = event.detail);
    	const SMUITextfieldLeadingIcon_unmount_handler = () => $$invalidate(29, leadingIcon = undefined);
    	const SMUITextfieldTrailingIcon_mount_handler = event => $$invalidate(30, trailingIcon = event.detail);
    	const SMUITextfieldTrailingIcon_unmount_handler = () => $$invalidate(30, trailingIcon = undefined);
    	const SMUITextfieldCharacterCounter_mount_handler = event => $$invalidate(32, characterCounter = event.detail);
    	const SMUITextfieldCharacterCounter_unmount_handler = () => $$invalidate(32, characterCounter = undefined);

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(24, element);
    		});
    	}

    	const SMUITextfieldLeadingIcon_mount_handler_1 = event => $$invalidate(29, leadingIcon = event.detail);
    	const SMUITextfieldLeadingIcon_unmount_handler_1 = () => $$invalidate(29, leadingIcon = undefined);
    	const SMUITextfieldTrailingIcon_mount_handler_1 = event => $$invalidate(30, trailingIcon = event.detail);
    	const SMUITextfieldTrailingIcon_unmount_handler_1 = () => $$invalidate(30, trailingIcon = undefined);
    	const SMUITextfieldHelperText_id_handler = event => $$invalidate(27, helperId = event.detail);
    	const SMUITextfieldHelperText_mount_handler = event => $$invalidate(31, helperText = event.detail);

    	const SMUITextfieldHelperText_unmount_handler = () => {
    		$$invalidate(27, helperId = undefined);
    		$$invalidate(31, helperText = undefined);
    	};

    	const SMUITextfieldCharacterCounter_mount_handler_1 = event => $$invalidate(32, characterCounter = event.detail);
    	const SMUITextfieldCharacterCounter_unmount_handler_1 = () => $$invalidate(32, characterCounter = undefined);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(41, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(8, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(9, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(10, style = $$new_props.style);
    		if ('ripple' in $$new_props) $$invalidate(11, ripple = $$new_props.ripple);
    		if ('disabled' in $$new_props) $$invalidate(12, disabled = $$new_props.disabled);
    		if ('required' in $$new_props) $$invalidate(13, required = $$new_props.required);
    		if ('textarea' in $$new_props) $$invalidate(14, textarea = $$new_props.textarea);
    		if ('variant' in $$new_props) $$invalidate(15, variant = $$new_props.variant);
    		if ('noLabel' in $$new_props) $$invalidate(16, noLabel = $$new_props.noLabel);
    		if ('label' in $$new_props) $$invalidate(17, label = $$new_props.label);
    		if ('type' in $$new_props) $$invalidate(18, type = $$new_props.type);
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('files' in $$new_props) $$invalidate(3, files = $$new_props.files);
    		if ('invalid' in $$new_props) $$invalidate(1, invalid = $$new_props.invalid);
    		if ('updateInvalid' in $$new_props) $$invalidate(19, updateInvalid = $$new_props.updateInvalid);
    		if ('dirty' in $$new_props) $$invalidate(4, dirty = $$new_props.dirty);
    		if ('prefix' in $$new_props) $$invalidate(20, prefix = $$new_props.prefix);
    		if ('suffix' in $$new_props) $$invalidate(21, suffix = $$new_props.suffix);
    		if ('validateOnValueChange' in $$new_props) $$invalidate(43, validateOnValueChange = $$new_props.validateOnValueChange);
    		if ('useNativeValidation' in $$new_props) $$invalidate(44, useNativeValidation = $$new_props.useNativeValidation);
    		if ('withLeadingIcon' in $$new_props) $$invalidate(22, withLeadingIcon = $$new_props.withLeadingIcon);
    		if ('withTrailingIcon' in $$new_props) $$invalidate(23, withTrailingIcon = $$new_props.withTrailingIcon);
    		if ('input' in $$new_props) $$invalidate(2, input = $$new_props.input);
    		if ('floatingLabel' in $$new_props) $$invalidate(5, floatingLabel = $$new_props.floatingLabel);
    		if ('lineRipple' in $$new_props) $$invalidate(6, lineRipple = $$new_props.lineRipple);
    		if ('notchedOutline' in $$new_props) $$invalidate(7, notchedOutline = $$new_props.notchedOutline);
    		if ('$$scope' in $$new_props) $$invalidate(90, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MDCTextFieldFoundation,
    		events,
    		onMount,
    		onDestroy,
    		getContext,
    		tick,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		dispatch,
    		ContextFragment,
    		Ripple,
    		FloatingLabel,
    		LineRipple,
    		NotchedOutline,
    		HelperLine,
    		Prefix,
    		Suffix,
    		Input,
    		Textarea,
    		applyPassive,
    		forwardEvents,
    		uninitializedValue,
    		isUninitializedValue,
    		use,
    		className,
    		style,
    		ripple,
    		disabled,
    		required,
    		textarea,
    		variant,
    		noLabel,
    		label,
    		type,
    		value,
    		files,
    		valued,
    		invalid,
    		updateInvalid,
    		dirty,
    		prefix,
    		suffix,
    		validateOnValueChange,
    		useNativeValidation,
    		withLeadingIcon,
    		withTrailingIcon,
    		input,
    		floatingLabel,
    		lineRipple,
    		notchedOutline,
    		element,
    		instance,
    		internalClasses,
    		internalStyles,
    		helperId,
    		focused,
    		addLayoutListener,
    		removeLayoutListener,
    		initPromiseResolve,
    		initPromise,
    		leadingIcon,
    		trailingIcon,
    		helperText,
    		characterCounter,
    		previousValue,
    		hasClass,
    		addClass,
    		removeClass,
    		addStyle,
    		focus,
    		blur,
    		layout,
    		getElement,
    		inputElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('uninitializedValue' in $$props) uninitializedValue = $$new_props.uninitializedValue;
    		if ('use' in $$props) $$invalidate(8, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(9, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(10, style = $$new_props.style);
    		if ('ripple' in $$props) $$invalidate(11, ripple = $$new_props.ripple);
    		if ('disabled' in $$props) $$invalidate(12, disabled = $$new_props.disabled);
    		if ('required' in $$props) $$invalidate(13, required = $$new_props.required);
    		if ('textarea' in $$props) $$invalidate(14, textarea = $$new_props.textarea);
    		if ('variant' in $$props) $$invalidate(15, variant = $$new_props.variant);
    		if ('noLabel' in $$props) $$invalidate(16, noLabel = $$new_props.noLabel);
    		if ('label' in $$props) $$invalidate(17, label = $$new_props.label);
    		if ('type' in $$props) $$invalidate(18, type = $$new_props.type);
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('files' in $$props) $$invalidate(3, files = $$new_props.files);
    		if ('invalid' in $$props) $$invalidate(1, invalid = $$new_props.invalid);
    		if ('updateInvalid' in $$props) $$invalidate(19, updateInvalid = $$new_props.updateInvalid);
    		if ('dirty' in $$props) $$invalidate(4, dirty = $$new_props.dirty);
    		if ('prefix' in $$props) $$invalidate(20, prefix = $$new_props.prefix);
    		if ('suffix' in $$props) $$invalidate(21, suffix = $$new_props.suffix);
    		if ('validateOnValueChange' in $$props) $$invalidate(43, validateOnValueChange = $$new_props.validateOnValueChange);
    		if ('useNativeValidation' in $$props) $$invalidate(44, useNativeValidation = $$new_props.useNativeValidation);
    		if ('withLeadingIcon' in $$props) $$invalidate(22, withLeadingIcon = $$new_props.withLeadingIcon);
    		if ('withTrailingIcon' in $$props) $$invalidate(23, withTrailingIcon = $$new_props.withTrailingIcon);
    		if ('input' in $$props) $$invalidate(2, input = $$new_props.input);
    		if ('floatingLabel' in $$props) $$invalidate(5, floatingLabel = $$new_props.floatingLabel);
    		if ('lineRipple' in $$props) $$invalidate(6, lineRipple = $$new_props.lineRipple);
    		if ('notchedOutline' in $$props) $$invalidate(7, notchedOutline = $$new_props.notchedOutline);
    		if ('element' in $$props) $$invalidate(24, element = $$new_props.element);
    		if ('instance' in $$props) $$invalidate(49, instance = $$new_props.instance);
    		if ('internalClasses' in $$props) $$invalidate(25, internalClasses = $$new_props.internalClasses);
    		if ('internalStyles' in $$props) $$invalidate(26, internalStyles = $$new_props.internalStyles);
    		if ('helperId' in $$props) $$invalidate(27, helperId = $$new_props.helperId);
    		if ('focused' in $$props) $$invalidate(28, focused = $$new_props.focused);
    		if ('addLayoutListener' in $$props) addLayoutListener = $$new_props.addLayoutListener;
    		if ('removeLayoutListener' in $$props) removeLayoutListener = $$new_props.removeLayoutListener;
    		if ('initPromiseResolve' in $$props) initPromiseResolve = $$new_props.initPromiseResolve;
    		if ('initPromise' in $$props) $$invalidate(37, initPromise = $$new_props.initPromise);
    		if ('leadingIcon' in $$props) $$invalidate(29, leadingIcon = $$new_props.leadingIcon);
    		if ('trailingIcon' in $$props) $$invalidate(30, trailingIcon = $$new_props.trailingIcon);
    		if ('helperText' in $$props) $$invalidate(31, helperText = $$new_props.helperText);
    		if ('characterCounter' in $$props) $$invalidate(32, characterCounter = $$new_props.characterCounter);
    		if ('previousValue' in $$props) $$invalidate(50, previousValue = $$new_props.previousValue);
    		if ('inputElement' in $$props) $$invalidate(33, inputElement = $$new_props.inputElement);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*input*/ 4) {
    			$$invalidate(33, inputElement = input && input.getElement());
    		}

    		if ($$self.$$.dirty[0] & /*invalid, updateInvalid*/ 524290 | $$self.$$.dirty[1] & /*instance*/ 262144) {
    			if (instance && instance.isValid() !== !invalid) {
    				if (updateInvalid) {
    					$$invalidate(1, invalid = !instance.isValid());
    				} else {
    					instance.setValid(!invalid);
    				}
    			}
    		}

    		if ($$self.$$.dirty[1] & /*instance, validateOnValueChange*/ 266240) {
    			if (instance && instance.getValidateOnValueChange() !== validateOnValueChange) {
    				instance.setValidateOnValueChange(isUninitializedValue(validateOnValueChange)
    				? false
    				: validateOnValueChange);
    			}
    		}

    		if ($$self.$$.dirty[1] & /*instance, useNativeValidation*/ 270336) {
    			if (instance) {
    				instance.setUseNativeValidation(isUninitializedValue(useNativeValidation)
    				? true
    				: useNativeValidation);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*disabled*/ 4096 | $$self.$$.dirty[1] & /*instance*/ 262144) {
    			if (instance) {
    				instance.setDisabled(disabled);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*value*/ 1 | $$self.$$.dirty[1] & /*instance, previousValue*/ 786432) {
    			if (instance && valued && previousValue !== value) {
    				$$invalidate(50, previousValue = value);

    				// Check the data is flowing down.
    				const stringValue = `${value}`;

    				if (instance.getValue() !== stringValue) {
    					instance.setValue(stringValue);
    				}
    			}
    		}
    	};

    	return [
    		value,
    		invalid,
    		input,
    		files,
    		dirty,
    		floatingLabel,
    		lineRipple,
    		notchedOutline,
    		use,
    		className,
    		style,
    		ripple,
    		disabled,
    		required,
    		textarea,
    		variant,
    		noLabel,
    		label,
    		type,
    		updateInvalid,
    		prefix,
    		suffix,
    		withLeadingIcon,
    		withTrailingIcon,
    		element,
    		internalClasses,
    		internalStyles,
    		helperId,
    		focused,
    		leadingIcon,
    		trailingIcon,
    		helperText,
    		characterCounter,
    		inputElement,
    		forwardEvents,
    		isUninitializedValue,
    		valued,
    		initPromise,
    		addClass,
    		removeClass,
    		addStyle,
    		$$restProps,
    		$$slots,
    		validateOnValueChange,
    		useNativeValidation,
    		focus,
    		blur,
    		layout,
    		getElement,
    		instance,
    		previousValue,
    		slots,
    		floatinglabel_binding,
    		floatinglabel_binding_1,
    		notchedoutline_binding,
    		textarea_1_binding,
    		textarea_1_value_binding,
    		textarea_1_dirty_binding,
    		textarea_1_invalid_binding,
    		blur_handler,
    		focus_handler,
    		blur_handler_1,
    		focus_handler_1,
    		input_1_binding,
    		input_1_value_binding,
    		input_1_files_binding,
    		input_1_dirty_binding,
    		input_1_invalid_binding,
    		blur_handler_2,
    		focus_handler_2,
    		blur_handler_3,
    		focus_handler_3,
    		lineripple_binding,
    		label_1_binding,
    		SMUITextfieldLeadingIcon_mount_handler,
    		SMUITextfieldLeadingIcon_unmount_handler,
    		SMUITextfieldTrailingIcon_mount_handler,
    		SMUITextfieldTrailingIcon_unmount_handler,
    		SMUITextfieldCharacterCounter_mount_handler,
    		SMUITextfieldCharacterCounter_unmount_handler,
    		div_binding,
    		SMUITextfieldLeadingIcon_mount_handler_1,
    		SMUITextfieldLeadingIcon_unmount_handler_1,
    		SMUITextfieldTrailingIcon_mount_handler_1,
    		SMUITextfieldTrailingIcon_unmount_handler_1,
    		SMUITextfieldHelperText_id_handler,
    		SMUITextfieldHelperText_mount_handler,
    		SMUITextfieldHelperText_unmount_handler,
    		SMUITextfieldCharacterCounter_mount_handler_1,
    		SMUITextfieldCharacterCounter_unmount_handler_1,
    		$$scope
    	];
    }

    class Textfield extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance_1$4,
    			create_fragment$c,
    			safe_not_equal,
    			{
    				use: 8,
    				class: 9,
    				style: 10,
    				ripple: 11,
    				disabled: 12,
    				required: 13,
    				textarea: 14,
    				variant: 15,
    				noLabel: 16,
    				label: 17,
    				type: 18,
    				value: 0,
    				files: 3,
    				invalid: 1,
    				updateInvalid: 19,
    				dirty: 4,
    				prefix: 20,
    				suffix: 21,
    				validateOnValueChange: 43,
    				useNativeValidation: 44,
    				withLeadingIcon: 22,
    				withTrailingIcon: 23,
    				input: 2,
    				floatingLabel: 5,
    				lineRipple: 6,
    				notchedOutline: 7,
    				focus: 45,
    				blur: 46,
    				layout: 47,
    				getElement: 48
    			},
    			null,
    			[-1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Textfield",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get use() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ripple() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ripple(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get required() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set required(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get textarea() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textarea(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get variant() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variant(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noLabel() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noLabel(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get files() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set files(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get updateInvalid() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set updateInvalid(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dirty() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dirty(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get suffix() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set suffix(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get validateOnValueChange() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set validateOnValueChange(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get useNativeValidation() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set useNativeValidation(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get withLeadingIcon() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set withLeadingIcon(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get withTrailingIcon() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set withTrailingIcon(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get input() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get floatingLabel() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set floatingLabel(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lineRipple() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lineRipple(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get notchedOutline() {
    		throw new Error_1$1("<Textfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set notchedOutline(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focus() {
    		return this.$$.ctx[45];
    	}

    	set focus(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blur() {
    		return this.$$.ctx[46];
    	}

    	set blur(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get layout() {
    		return this.$$.ctx[47];
    	}

    	set layout(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[48];
    	}

    	set getElement(value) {
    		throw new Error_1$1("<Textfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/button/dist/Button.svelte generated by Svelte v3.46.4 */
    const file$a = "node_modules/@smui/button/dist/Button.svelte";

    // (50:10) {#if touch}
    function create_if_block$4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "mdc-button__touch");
    			add_location(div, file$a, 49, 21, 1522);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(50:10) {#if touch}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <svelte:component   this={component}   bind:this={element}   use={[     [       Ripple,       {         ripple,         unbounded: false,         color,         disabled: !!$$restProps.disabled,         addClass,         removeClass,         addStyle,       },     ],     forwardEvents,     ...use,   ]}   class={classMap({     [className]: true,     'mdc-button': true,     'mdc-button--raised': variant === 'raised',     'mdc-button--unelevated': variant === 'unelevated',     'mdc-button--outlined': variant === 'outlined',     'smui-button--color-secondary': color === 'secondary',     'mdc-button--touch': touch,     'mdc-card__action': context === 'card:action',     'mdc-card__action--button': context === 'card:action',     'mdc-dialog__button': context === 'dialog:action',     'mdc-top-app-bar__navigation-icon': context === 'top-app-bar:navigation',     'mdc-top-app-bar__action-item': context === 'top-app-bar:action',     'mdc-snackbar__action': context === 'snackbar:actions',     'mdc-banner__secondary-action': context === 'banner' && secondary,     'mdc-banner__primary-action': context === 'banner' && !secondary,     'mdc-tooltip__action': context === 'tooltip:rich-actions',     ...internalClasses,   })}   style={Object.entries(internalStyles)     .map(([name, value]) => `${name}: ${value};`)     .concat([style])     .join(' ')}   {...actionProp}   {...defaultProp}   {...secondaryProp}   {href}   on:click={handleClick}   {...$$restProps}   >
    function create_default_slot$5(ctx) {
    	let div;
    	let t;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[27].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[29], null);
    	let if_block = /*touch*/ ctx[6] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			if (default_slot) default_slot.c();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "class", "mdc-button__ripple");
    			add_location(div, file$a, 48, 3, 1466);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 536870912)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[29],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[29])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[29], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*touch*/ ctx[6]) {
    				if (if_block) ; else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(1:0) <svelte:component   this={component}   bind:this={element}   use={[     [       Ripple,       {         ripple,         unbounded: false,         color,         disabled: !!$$restProps.disabled,         addClass,         removeClass,         addStyle,       },     ],     forwardEvents,     ...use,   ]}   class={classMap({     [className]: true,     'mdc-button': true,     'mdc-button--raised': variant === 'raised',     'mdc-button--unelevated': variant === 'unelevated',     'mdc-button--outlined': variant === 'outlined',     'smui-button--color-secondary': color === 'secondary',     'mdc-button--touch': touch,     'mdc-card__action': context === 'card:action',     'mdc-card__action--button': context === 'card:action',     'mdc-dialog__button': context === 'dialog:action',     'mdc-top-app-bar__navigation-icon': context === 'top-app-bar:navigation',     'mdc-top-app-bar__action-item': context === 'top-app-bar:action',     'mdc-snackbar__action': context === 'snackbar:actions',     'mdc-banner__secondary-action': context === 'banner' && secondary,     'mdc-banner__primary-action': context === 'banner' && !secondary,     'mdc-tooltip__action': context === 'tooltip:rich-actions',     ...internalClasses,   })}   style={Object.entries(internalStyles)     .map(([name, value]) => `${name}: ${value};`)     .concat([style])     .join(' ')}   {...actionProp}   {...defaultProp}   {...secondaryProp}   {href}   on:click={handleClick}   {...$$restProps}   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{
    			use: [
    				[
    					Ripple,
    					{
    						ripple: /*ripple*/ ctx[3],
    						unbounded: false,
    						color: /*color*/ ctx[4],
    						disabled: !!/*$$restProps*/ ctx[22].disabled,
    						addClass: /*addClass*/ ctx[18],
    						removeClass: /*removeClass*/ ctx[19],
    						addStyle: /*addStyle*/ ctx[20]
    					}
    				],
    				/*forwardEvents*/ ctx[16],
    				.../*use*/ ctx[0]
    			]
    		},
    		{
    			class: classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-button': true,
    				'mdc-button--raised': /*variant*/ ctx[5] === 'raised',
    				'mdc-button--unelevated': /*variant*/ ctx[5] === 'unelevated',
    				'mdc-button--outlined': /*variant*/ ctx[5] === 'outlined',
    				'smui-button--color-secondary': /*color*/ ctx[4] === 'secondary',
    				'mdc-button--touch': /*touch*/ ctx[6],
    				'mdc-card__action': /*context*/ ctx[17] === 'card:action',
    				'mdc-card__action--button': /*context*/ ctx[17] === 'card:action',
    				'mdc-dialog__button': /*context*/ ctx[17] === 'dialog:action',
    				'mdc-top-app-bar__navigation-icon': /*context*/ ctx[17] === 'top-app-bar:navigation',
    				'mdc-top-app-bar__action-item': /*context*/ ctx[17] === 'top-app-bar:action',
    				'mdc-snackbar__action': /*context*/ ctx[17] === 'snackbar:actions',
    				'mdc-banner__secondary-action': /*context*/ ctx[17] === 'banner' && /*secondary*/ ctx[8],
    				'mdc-banner__primary-action': /*context*/ ctx[17] === 'banner' && !/*secondary*/ ctx[8],
    				'mdc-tooltip__action': /*context*/ ctx[17] === 'tooltip:rich-actions',
    				.../*internalClasses*/ ctx[11]
    			})
    		},
    		{
    			style: Object.entries(/*internalStyles*/ ctx[12]).map(func$3).concat([/*style*/ ctx[2]]).join(' ')
    		},
    		/*actionProp*/ ctx[15],
    		/*defaultProp*/ ctx[14],
    		/*secondaryProp*/ ctx[13],
    		{ href: /*href*/ ctx[7] },
    		/*$$restProps*/ ctx[22]
    	];

    	var switch_value = /*component*/ ctx[9];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot$5] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		/*switch_instance_binding*/ ctx[28](switch_instance);
    		switch_instance.$on("click", /*handleClick*/ ctx[21]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = (dirty & /*Ripple, ripple, color, $$restProps, addClass, removeClass, addStyle, forwardEvents, use, classMap, className, variant, touch, context, secondary, internalClasses, Object, internalStyles, style, actionProp, defaultProp, secondaryProp, href*/ 6289919)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*Ripple, ripple, color, $$restProps, addClass, removeClass, addStyle, forwardEvents, use*/ 6094873 && {
    						use: [
    							[
    								Ripple,
    								{
    									ripple: /*ripple*/ ctx[3],
    									unbounded: false,
    									color: /*color*/ ctx[4],
    									disabled: !!/*$$restProps*/ ctx[22].disabled,
    									addClass: /*addClass*/ ctx[18],
    									removeClass: /*removeClass*/ ctx[19],
    									addStyle: /*addStyle*/ ctx[20]
    								}
    							],
    							/*forwardEvents*/ ctx[16],
    							.../*use*/ ctx[0]
    						]
    					},
    					dirty & /*classMap, className, variant, color, touch, context, secondary, internalClasses*/ 133490 && {
    						class: classMap({
    							[/*className*/ ctx[1]]: true,
    							'mdc-button': true,
    							'mdc-button--raised': /*variant*/ ctx[5] === 'raised',
    							'mdc-button--unelevated': /*variant*/ ctx[5] === 'unelevated',
    							'mdc-button--outlined': /*variant*/ ctx[5] === 'outlined',
    							'smui-button--color-secondary': /*color*/ ctx[4] === 'secondary',
    							'mdc-button--touch': /*touch*/ ctx[6],
    							'mdc-card__action': /*context*/ ctx[17] === 'card:action',
    							'mdc-card__action--button': /*context*/ ctx[17] === 'card:action',
    							'mdc-dialog__button': /*context*/ ctx[17] === 'dialog:action',
    							'mdc-top-app-bar__navigation-icon': /*context*/ ctx[17] === 'top-app-bar:navigation',
    							'mdc-top-app-bar__action-item': /*context*/ ctx[17] === 'top-app-bar:action',
    							'mdc-snackbar__action': /*context*/ ctx[17] === 'snackbar:actions',
    							'mdc-banner__secondary-action': /*context*/ ctx[17] === 'banner' && /*secondary*/ ctx[8],
    							'mdc-banner__primary-action': /*context*/ ctx[17] === 'banner' && !/*secondary*/ ctx[8],
    							'mdc-tooltip__action': /*context*/ ctx[17] === 'tooltip:rich-actions',
    							.../*internalClasses*/ ctx[11]
    						})
    					},
    					dirty & /*Object, internalStyles, style*/ 4100 && {
    						style: Object.entries(/*internalStyles*/ ctx[12]).map(func$3).concat([/*style*/ ctx[2]]).join(' ')
    					},
    					dirty & /*actionProp*/ 32768 && get_spread_object(/*actionProp*/ ctx[15]),
    					dirty & /*defaultProp*/ 16384 && get_spread_object(/*defaultProp*/ ctx[14]),
    					dirty & /*secondaryProp*/ 8192 && get_spread_object(/*secondaryProp*/ ctx[13]),
    					dirty & /*href*/ 128 && { href: /*href*/ ctx[7] },
    					dirty & /*$$restProps*/ 4194304 && get_spread_object(/*$$restProps*/ ctx[22])
    				])
    			: {};

    			if (dirty & /*$$scope, touch*/ 536870976) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*component*/ ctx[9])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					/*switch_instance_binding*/ ctx[28](switch_instance);
    					switch_instance.$on("click", /*handleClick*/ ctx[21]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*switch_instance_binding*/ ctx[28](null);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$3 = ([name, value]) => `${name}: ${value};`;

    function instance$7($$self, $$props, $$invalidate) {
    	let actionProp;
    	let defaultProp;
    	let secondaryProp;

    	const omit_props_names = [
    		"use","class","style","ripple","color","variant","touch","href","action","defaultAction","secondary","component","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
    	let { ripple = true } = $$props;
    	let { color = 'primary' } = $$props;
    	let { variant = 'text' } = $$props;
    	let { touch = false } = $$props;
    	let { href = undefined } = $$props;
    	let { action = 'close' } = $$props;
    	let { defaultAction = false } = $$props;
    	let { secondary = false } = $$props;
    	let element;
    	let internalClasses = {};
    	let internalStyles = {};
    	let context = getContext('SMUI:button:context');
    	let { component = href == null ? Button : A } = $$props;
    	let previousDisabled = $$restProps.disabled;
    	setContext('SMUI:label:context', 'button');
    	setContext('SMUI:icon:context', 'button');

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(11, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(11, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addStyle(name, value) {
    		if (internalStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete internalStyles[name];
    				$$invalidate(12, internalStyles);
    			} else {
    				$$invalidate(12, internalStyles[name] = value, internalStyles);
    			}
    		}
    	}

    	function handleClick() {
    		if (context === 'banner') {
    			dispatch(getElement(), secondary
    			? 'SMUIBannerButton:secondaryActionClick'
    			: 'SMUIBannerButton:primaryActionClick');
    		}
    	}

    	function getElement() {
    		return element.getElement();
    	}

    	function switch_instance_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(10, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(30, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(22, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(2, style = $$new_props.style);
    		if ('ripple' in $$new_props) $$invalidate(3, ripple = $$new_props.ripple);
    		if ('color' in $$new_props) $$invalidate(4, color = $$new_props.color);
    		if ('variant' in $$new_props) $$invalidate(5, variant = $$new_props.variant);
    		if ('touch' in $$new_props) $$invalidate(6, touch = $$new_props.touch);
    		if ('href' in $$new_props) $$invalidate(7, href = $$new_props.href);
    		if ('action' in $$new_props) $$invalidate(23, action = $$new_props.action);
    		if ('defaultAction' in $$new_props) $$invalidate(24, defaultAction = $$new_props.defaultAction);
    		if ('secondary' in $$new_props) $$invalidate(8, secondary = $$new_props.secondary);
    		if ('component' in $$new_props) $$invalidate(9, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(29, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		getContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		dispatch,
    		Ripple,
    		A,
    		Button,
    		forwardEvents,
    		use,
    		className,
    		style,
    		ripple,
    		color,
    		variant,
    		touch,
    		href,
    		action,
    		defaultAction,
    		secondary,
    		element,
    		internalClasses,
    		internalStyles,
    		context,
    		component,
    		previousDisabled,
    		addClass,
    		removeClass,
    		addStyle,
    		handleClick,
    		getElement,
    		secondaryProp,
    		defaultProp,
    		actionProp
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(30, $$props = assign(assign({}, $$props), $$new_props));
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(2, style = $$new_props.style);
    		if ('ripple' in $$props) $$invalidate(3, ripple = $$new_props.ripple);
    		if ('color' in $$props) $$invalidate(4, color = $$new_props.color);
    		if ('variant' in $$props) $$invalidate(5, variant = $$new_props.variant);
    		if ('touch' in $$props) $$invalidate(6, touch = $$new_props.touch);
    		if ('href' in $$props) $$invalidate(7, href = $$new_props.href);
    		if ('action' in $$props) $$invalidate(23, action = $$new_props.action);
    		if ('defaultAction' in $$props) $$invalidate(24, defaultAction = $$new_props.defaultAction);
    		if ('secondary' in $$props) $$invalidate(8, secondary = $$new_props.secondary);
    		if ('element' in $$props) $$invalidate(10, element = $$new_props.element);
    		if ('internalClasses' in $$props) $$invalidate(11, internalClasses = $$new_props.internalClasses);
    		if ('internalStyles' in $$props) $$invalidate(12, internalStyles = $$new_props.internalStyles);
    		if ('context' in $$props) $$invalidate(17, context = $$new_props.context);
    		if ('component' in $$props) $$invalidate(9, component = $$new_props.component);
    		if ('previousDisabled' in $$props) $$invalidate(26, previousDisabled = $$new_props.previousDisabled);
    		if ('secondaryProp' in $$props) $$invalidate(13, secondaryProp = $$new_props.secondaryProp);
    		if ('defaultProp' in $$props) $$invalidate(14, defaultProp = $$new_props.defaultProp);
    		if ('actionProp' in $$props) $$invalidate(15, actionProp = $$new_props.actionProp);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(15, actionProp = context === 'dialog:action' && action != null
    		? { 'data-mdc-dialog-action': action }
    		: { action: $$props.action });

    		$$invalidate(14, defaultProp = context === 'dialog:action' && defaultAction
    		? { 'data-mdc-dialog-button-default': '' }
    		: { default: $$props.default });

    		$$invalidate(13, secondaryProp = context === 'banner'
    		? {}
    		: { secondary: $$props.secondary });

    		if (previousDisabled !== $$restProps.disabled) {
    			getElement().blur();
    			$$invalidate(26, previousDisabled = $$restProps.disabled);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		use,
    		className,
    		style,
    		ripple,
    		color,
    		variant,
    		touch,
    		href,
    		secondary,
    		component,
    		element,
    		internalClasses,
    		internalStyles,
    		secondaryProp,
    		defaultProp,
    		actionProp,
    		forwardEvents,
    		context,
    		addClass,
    		removeClass,
    		addStyle,
    		handleClick,
    		$$restProps,
    		action,
    		defaultAction,
    		getElement,
    		previousDisabled,
    		slots,
    		switch_instance_binding,
    		$$scope
    	];
    }

    class Button_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$b, safe_not_equal, {
    			use: 0,
    			class: 1,
    			style: 2,
    			ripple: 3,
    			color: 4,
    			variant: 5,
    			touch: 6,
    			href: 7,
    			action: 23,
    			defaultAction: 24,
    			secondary: 8,
    			component: 9,
    			getElement: 25
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button_1",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get use() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ripple() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ripple(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get variant() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variant(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get touch() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set touch(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get action() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set action(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get defaultAction() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set defaultAction(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get secondary() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set secondary(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[25];
    	}

    	set getElement(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/modules/settings/Settings.svelte generated by Svelte v3.46.4 */
    const file$9 = "src/modules/settings/Settings.svelte";

    // (31:6) <Button type="submit" variant="raised">
    function create_default_slot$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Zapisz");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(31:6) <Button type=\\\"submit\\\" variant=\\\"raised\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let section;
    	let h1;
    	let t1;
    	let div;
    	let h3;
    	let t3;
    	let p;
    	let t4;
    	let a;
    	let t6;
    	let form_1;
    	let textfield0;
    	let updating_value;
    	let t7;
    	let textfield1;
    	let updating_value_1;
    	let t8;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	function textfield0_value_binding(value) {
    		/*textfield0_value_binding*/ ctx[2](value);
    	}

    	let textfield0_props = { variant: "outlined", label: "Token" };

    	if (/*form*/ ctx[0].token !== void 0) {
    		textfield0_props.value = /*form*/ ctx[0].token;
    	}

    	textfield0 = new Textfield({ props: textfield0_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield0, 'value', textfield0_value_binding));

    	function textfield1_value_binding(value) {
    		/*textfield1_value_binding*/ ctx[3](value);
    	}

    	let textfield1_props = { variant: "outlined", label: "Account Id" };

    	if (/*form*/ ctx[0].accountId !== void 0) {
    		textfield1_props.value = /*form*/ ctx[0].accountId;
    	}

    	textfield1 = new Textfield({ props: textfield1_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield1, 'value', textfield1_value_binding));

    	button = new Button_1({
    			props: {
    				type: "submit",
    				variant: "raised",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			h1.textContent = "Ustawienia";
    			t1 = space();
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "Harvest";
    			t3 = space();
    			p = element("p");
    			t4 = text("Klucz API mozesz znaleźć tutaj: ");
    			a = element("a");
    			a.textContent = "https://id.getharvest.com/developers";
    			t6 = space();
    			form_1 = element("form");
    			create_component(textfield0.$$.fragment);
    			t7 = space();
    			create_component(textfield1.$$.fragment);
    			t8 = space();
    			create_component(button.$$.fragment);
    			add_location(h1, file$9, 17, 2, 477);
    			add_location(h3, file$9, 19, 4, 533);
    			attr_dev(a, "href", "https://id.getharvest.com/developers");
    			attr_dev(a, "rel", "noopener noreferrer");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$9, 21, 38, 596);
    			add_location(p, file$9, 20, 4, 554);
    			attr_dev(form_1, "class", "harvest-form svelte-18qhpaz");
    			add_location(form_1, file$9, 27, 4, 770);
    			attr_dev(div, "class", "section-wrapper svelte-18qhpaz");
    			add_location(div, file$9, 18, 2, 499);
    			attr_dev(section, "class", "svelte-18qhpaz");
    			add_location(section, file$9, 16, 0, 465);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(section, t1);
    			append_dev(section, div);
    			append_dev(div, h3);
    			append_dev(div, t3);
    			append_dev(div, p);
    			append_dev(p, t4);
    			append_dev(p, a);
    			append_dev(div, t6);
    			append_dev(div, form_1);
    			mount_component(textfield0, form_1, null);
    			append_dev(form_1, t7);
    			mount_component(textfield1, form_1, null);
    			append_dev(form_1, t8);
    			mount_component(button, form_1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form_1, "submit", prevent_default(/*onSubmit*/ ctx[1]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const textfield0_changes = {};

    			if (!updating_value && dirty & /*form*/ 1) {
    				updating_value = true;
    				textfield0_changes.value = /*form*/ ctx[0].token;
    				add_flush_callback(() => updating_value = false);
    			}

    			textfield0.$set(textfield0_changes);
    			const textfield1_changes = {};

    			if (!updating_value_1 && dirty & /*form*/ 1) {
    				updating_value_1 = true;
    				textfield1_changes.value = /*form*/ ctx[0].accountId;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			textfield1.$set(textfield1_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textfield0.$$.fragment, local);
    			transition_in(textfield1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textfield0.$$.fragment, local);
    			transition_out(textfield1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(textfield0);
    			destroy_component(textfield1);
    			destroy_component(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Settings', slots, []);
    	var _a;

    	let form = (_a = JSON.parse(localStorage.getItem('harvestAPI'))) !== null && _a !== void 0
    	? _a
    	: { token: '', accountId: '' };

    	setContext('harvestAPI', form);

    	const onSubmit = () => {
    		localStorage.setItem('harvestAPI', JSON.stringify(form));
    		push('/');
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Settings> was created with unknown prop '${key}'`);
    	});

    	function textfield0_value_binding(value) {
    		if ($$self.$$.not_equal(form.token, value)) {
    			form.token = value;
    			$$invalidate(0, form);
    		}
    	}

    	function textfield1_value_binding(value) {
    		if ($$self.$$.not_equal(form.accountId, value)) {
    			form.accountId = value;
    			$$invalidate(0, form);
    		}
    	}

    	$$self.$capture_state = () => ({
    		_a,
    		push,
    		Textfield,
    		Button: Button_1,
    		setContext,
    		form,
    		onSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ('_a' in $$props) _a = $$props._a;
    		if ('form' in $$props) $$invalidate(0, form = $$props.form);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [form, onSubmit, textfield0_value_binding, textfield1_value_binding];
    }

    class Settings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Settings",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /**
     * @license
     * Copyright 2020 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * Style classes for segmented-button
     */
    var cssClasses$3 = {
        SINGLE_SELECT: 'mdc-segmented-button--single-select'
    };

    /**
     * @license
     * Copyright 2020 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCSegmentedButtonFoundation = /** @class */ (function (_super) {
        __extends(MDCSegmentedButtonFoundation, _super);
        function MDCSegmentedButtonFoundation(adapter) {
            return _super.call(this, __assign$1(__assign$1({}, MDCSegmentedButtonFoundation.defaultAdapter), adapter)) || this;
        }
        Object.defineProperty(MDCSegmentedButtonFoundation, "defaultAdapter", {
            get: function () {
                return {
                    hasClass: function () { return false; }, getSegments: function () { return []; },
                    selectSegment: function () { return undefined; },
                    unselectSegment: function () { return undefined; },
                    notifySelectedChange: function () { return undefined; }
                };
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Sets identified child segment to be selected
         *
         * @param indexOrSegmentId Number index or string segmentId that identifies
         * child segment
         */
        MDCSegmentedButtonFoundation.prototype.selectSegment = function (indexOrSegmentId) {
            this.adapter.selectSegment(indexOrSegmentId);
        };
        /**
         * Sets identified child segment to be not selected
         *
         * @param indexOrSegmentId Number index or string segmentId that identifies
         * child segment
         */
        MDCSegmentedButtonFoundation.prototype.unselectSegment = function (indexOrSegmentId) {
            this.adapter.unselectSegment(indexOrSegmentId);
        };
        /**
         * @return Returns currently selected child segments as readonly list of
         * SegmentDetails
         */
        MDCSegmentedButtonFoundation.prototype.getSelectedSegments = function () {
            return this.adapter.getSegments().filter(function (segmentDetail) { return segmentDetail.selected; });
        };
        /**
         * @param indexOrSegmentId Number index or string segmentId that identifies
         * child segment
         * @return Returns true if identified child segment is currently selected,
         * otherwise returns false
         */
        MDCSegmentedButtonFoundation.prototype.isSegmentSelected = function (indexOrSegmentId) {
            return this.adapter.getSegments().some(function (segmentDetail) { return (segmentDetail.index === indexOrSegmentId ||
                segmentDetail.segmentId === indexOrSegmentId) &&
                segmentDetail.selected; });
        };
        /**
         * @return Returns true if segmented button is single select, otherwise
         * returns false
         */
        MDCSegmentedButtonFoundation.prototype.isSingleSelect = function () {
            return this.adapter.hasClass(cssClasses$3.SINGLE_SELECT);
        };
        /**
         * Called when child segment's selected status may have changed. If segmented
         * button is single select, unselects all child segments other than identified
         * child segment. Finally, emits event to client.
         *
         * @param detail Child segment affected represented as SegmentDetail
         * @event change With detail - SegmentDetail
         */
        MDCSegmentedButtonFoundation.prototype.handleSelected = function (detail) {
            if (this.isSingleSelect()) {
                this.unselectPrevSelected(detail.index);
            }
            this.adapter.notifySelectedChange(detail);
        };
        /**
         * Sets all child segments to be not selected except for child segment
         * identified by index
         *
         * @param index Index of child segment to not unselect
         */
        MDCSegmentedButtonFoundation.prototype.unselectPrevSelected = function (index) {
            var e_1, _a;
            try {
                for (var _b = __values(this.getSelectedSegments()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var selectedSegment = _c.value;
                    if (selectedSegment.index !== index) {
                        this.unselectSegment(selectedSegment.index);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        return MDCSegmentedButtonFoundation;
    }(MDCFoundation));

    /* node_modules/@smui/segmented-button/dist/SegmentedButton.svelte generated by Svelte v3.46.4 */
    const file$8 = "node_modules/@smui/segmented-button/dist/SegmentedButton.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	child_ctx[32] = i;
    	return child_ctx;
    }

    const get_default_slot_changes = dirty => ({ segment: dirty[0] & /*segments*/ 4 });
    const get_default_slot_context = ctx => ({ segment: /*segment*/ ctx[30] });

    // (18:6) <ContextFragment         key="SMUI:segmented-button:segment:initialSelected"         value={initialSelected[i]}       >
    function create_default_slot_1$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope, segments*/ 2097156)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[21],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[21])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[21], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(18:6) <ContextFragment         key=\\\"SMUI:segmented-button:segment:initialSelected\\\"         value={initialSelected[i]}       >",
    		ctx
    	});

    	return block;
    }

    // (17:4) <ContextFragment key="SMUI:segmented-button:segment:index" value={i}>
    function create_default_slot$3(ctx) {
    	let contextfragment;
    	let t;
    	let current;

    	contextfragment = new ContextFragment({
    			props: {
    				key: "SMUI:segmented-button:segment:initialSelected",
    				value: /*initialSelected*/ ctx[8][/*i*/ ctx[32]],
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(contextfragment.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(contextfragment, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const contextfragment_changes = {};
    			if (dirty[0] & /*segments*/ 4) contextfragment_changes.value = /*initialSelected*/ ctx[8][/*i*/ ctx[32]];

    			if (dirty[0] & /*$$scope, segments*/ 2097156) {
    				contextfragment_changes.$$scope = { dirty, ctx };
    			}

    			contextfragment.$set(contextfragment_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contextfragment.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contextfragment.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contextfragment, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(17:4) <ContextFragment key=\\\"SMUI:segmented-button:segment:index\\\" value={i}>",
    		ctx
    	});

    	return block;
    }

    // (16:2) {#each segments as segment, i (key(segment))}
    function create_each_block(key_2, ctx) {
    	let first;
    	let contextfragment;
    	let current;

    	contextfragment = new ContextFragment({
    			props: {
    				key: "SMUI:segmented-button:segment:index",
    				value: /*i*/ ctx[32],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_2,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(contextfragment.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(contextfragment, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const contextfragment_changes = {};
    			if (dirty[0] & /*segments*/ 4) contextfragment_changes.value = /*i*/ ctx[32];

    			if (dirty[0] & /*$$scope, segments*/ 2097156) {
    				contextfragment_changes.$$scope = { dirty, ctx };
    			}

    			contextfragment.$set(contextfragment_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contextfragment.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contextfragment.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(contextfragment, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(16:2) {#each segments as segment, i (key(segment))}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let div_class_value;
    	let div_role_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*segments*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*key*/ ctx[3](/*segment*/ ctx[30]);
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	let div_levels = [
    		{
    			class: div_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-segmented-button': true,
    				'mdc-segmented-button--single-select': /*singleSelect*/ ctx[4]
    			})
    		},
    		{
    			role: div_role_value = /*singleSelect*/ ctx[4] ? 'radiogroup' : 'group'
    		},
    		/*$$restProps*/ ctx[12]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_attributes(div, div_data);
    			add_location(div, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			/*div_binding*/ ctx[17](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[7].call(null, div)),
    					listen_dev(div, "SMUISegmentedButtonSegment:mount", /*SMUISegmentedButtonSegment_mount_handler*/ ctx[18], false, false, false),
    					listen_dev(div, "SMUISegmentedButtonSegment:unmount", /*SMUISegmentedButtonSegment_unmount_handler*/ ctx[19], false, false, false),
    					listen_dev(div, "selected", /*selected_handler*/ ctx[20], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*segments, initialSelected, $$scope, key*/ 2097420) {
    				each_value = /*segments*/ ctx[2];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block, null, get_each_context);
    				check_outros();
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty[0] & /*className, singleSelect*/ 18 && div_class_value !== (div_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-segmented-button': true,
    					'mdc-segmented-button--single-select': /*singleSelect*/ ctx[4]
    				}))) && { class: div_class_value },
    				(!current || dirty[0] & /*singleSelect*/ 16 && div_role_value !== (div_role_value = /*singleSelect*/ ctx[4] ? 'radiogroup' : 'group')) && { role: div_role_value },
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			/*div_binding*/ ctx[17](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function setDifference(setA, setB) {
    	let _difference = new Set(setA);

    	for (let elem of setB) {
    		_difference.delete(elem);
    	}

    	return _difference;
    }

    function instance_1$3($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","segments","key","singleSelect","selected","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $singleSelectStore;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SegmentedButton', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { segments = [] } = $$props;
    	let { key = segment => segment } = $$props;
    	let { singleSelect = false } = $$props;
    	let { selected = singleSelect ? undefined : [] } = $$props;
    	let element;
    	let instance;
    	let segmentAccessorMap = {};
    	let segmentAccessorWeakMap = new WeakMap();
    	let initialSelected = segments.map(segmentId => singleSelect && selected === segmentId || !singleSelect && selected.indexOf(segmentId) !== -1);
    	setContext('SMUI:icon:context', 'segmented-button');
    	setContext('SMUI:label:context', 'segmented-button');
    	const singleSelectStore = writable(singleSelect);
    	validate_store(singleSelectStore, 'singleSelectStore');
    	component_subscribe($$self, singleSelectStore, value => $$invalidate(23, $singleSelectStore = value));
    	setContext('SMUI:segmented-button:singleSelect', singleSelectStore);
    	let previousSelected = singleSelect ? selected : new Set(selected);

    	onMount(() => {
    		$$invalidate(5, instance = new MDCSegmentedButtonFoundation({
    				hasClass: className => {
    					return getElement().classList.contains(className);
    				},
    				getSegments: () => {
    					return segments.map((segment, index) => ({
    						index,
    						selected: singleSelect
    						? selected === segment
    						: selected.indexOf(segment) !== -1
    					})); // segmentId: segment, // Not necessarily a string.
    				},
    				selectSegment,
    				unselectSegment,
    				notifySelectedChange: detail => {
    					if (detail.selected) {
    						selectSegment(detail.index);
    					} else {
    						unselectSegment(detail.index);
    					}

    					dispatch(getElement(), 'change', detail);
    				}
    			}));

    		instance.init();

    		return () => {
    			instance.destroy();
    		};
    	});

    	function handleSegmentMount(event) {
    		const accessor = event.detail;
    		addAccessor(accessor.segmentId, accessor);
    	}

    	function handleSegmentUnmount(event) {
    		const accessor = event.detail;
    		removeAccessor(accessor.segmentId);
    	}

    	function getAccessor(segmentId) {
    		return segmentId instanceof Object
    		? segmentAccessorWeakMap.get(segmentId)
    		: segmentAccessorMap[segmentId];
    	}

    	function addAccessor(segmentId, accessor) {
    		if (segmentId instanceof Object) {
    			segmentAccessorWeakMap.set(segmentId, accessor);
    		} else {
    			segmentAccessorMap[segmentId] = accessor;
    		}
    	}

    	function removeAccessor(segmentId) {
    		if (segmentId instanceof Object) {
    			segmentAccessorWeakMap.delete(segmentId);
    		} else {
    			delete segmentAccessorMap[segmentId];
    		}
    	}

    	function selectSegment(indexOrSegmentId) {
    		let index = segments.indexOf(indexOrSegmentId);

    		if (index === -1) {
    			index = indexOrSegmentId;
    		}

    		if (!singleSelect) {
    			const selIndex = selected.indexOf(segments[index]);

    			if (selIndex === -1) {
    				selected.push(segments[index]);
    				$$invalidate(13, selected);
    			}
    		} else if (selected !== segments[index]) {
    			$$invalidate(13, selected = segments[index]);
    		}

    		const accessor = getAccessor(segments[index]);

    		if (accessor) {
    			accessor.selected = true;
    		}
    	}

    	function unselectSegment(indexOrSegmentId) {
    		let index = segments.indexOf(indexOrSegmentId);

    		if (index === -1) {
    			index = indexOrSegmentId;
    		}

    		if (!singleSelect) {
    			const selIndex = selected.indexOf(segments[index]);

    			if (selIndex !== -1) {
    				selected.splice(selIndex, 1);
    				$$invalidate(13, selected);
    			}
    		} else if (selected === segments[index]) {
    			$$invalidate(13, selected = null);
    		}

    		const accessor = getAccessor(segments[index]);

    		if (accessor) {
    			accessor.selected = false;
    		}
    	}

    	function getElement() {
    		return element;
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(6, element);
    		});
    	}

    	const SMUISegmentedButtonSegment_mount_handler = event => handleSegmentMount(event);
    	const SMUISegmentedButtonSegment_unmount_handler = event => handleSegmentUnmount(event);
    	const selected_handler = event => instance && instance.handleSelected(event.detail);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('segments' in $$new_props) $$invalidate(2, segments = $$new_props.segments);
    		if ('key' in $$new_props) $$invalidate(3, key = $$new_props.key);
    		if ('singleSelect' in $$new_props) $$invalidate(4, singleSelect = $$new_props.singleSelect);
    		if ('selected' in $$new_props) $$invalidate(13, selected = $$new_props.selected);
    		if ('$$scope' in $$new_props) $$invalidate(21, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MDCSegmentedButtonFoundation,
    		onMount,
    		setContext,
    		writable,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		dispatch,
    		ContextFragment,
    		forwardEvents,
    		use,
    		className,
    		segments,
    		key,
    		singleSelect,
    		selected,
    		element,
    		instance,
    		segmentAccessorMap,
    		segmentAccessorWeakMap,
    		initialSelected,
    		singleSelectStore,
    		previousSelected,
    		setDifference,
    		handleSegmentMount,
    		handleSegmentUnmount,
    		getAccessor,
    		addAccessor,
    		removeAccessor,
    		selectSegment,
    		unselectSegment,
    		getElement,
    		$singleSelectStore
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('segments' in $$props) $$invalidate(2, segments = $$new_props.segments);
    		if ('key' in $$props) $$invalidate(3, key = $$new_props.key);
    		if ('singleSelect' in $$props) $$invalidate(4, singleSelect = $$new_props.singleSelect);
    		if ('selected' in $$props) $$invalidate(13, selected = $$new_props.selected);
    		if ('element' in $$props) $$invalidate(6, element = $$new_props.element);
    		if ('instance' in $$props) $$invalidate(5, instance = $$new_props.instance);
    		if ('segmentAccessorMap' in $$props) segmentAccessorMap = $$new_props.segmentAccessorMap;
    		if ('segmentAccessorWeakMap' in $$props) segmentAccessorWeakMap = $$new_props.segmentAccessorWeakMap;
    		if ('initialSelected' in $$props) $$invalidate(8, initialSelected = $$new_props.initialSelected);
    		if ('previousSelected' in $$props) $$invalidate(15, previousSelected = $$new_props.previousSelected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*singleSelect*/ 16) {
    			set_store_value(singleSelectStore, $singleSelectStore = singleSelect, $singleSelectStore);
    		}

    		if ($$self.$$.dirty[0] & /*instance, singleSelect, previousSelected, selected*/ 41008) {
    			if (instance && singleSelect && previousSelected !== selected) {
    				if (previousSelected != null) {
    					instance.unselectSegment(previousSelected);
    				}

    				$$invalidate(15, previousSelected = selected);

    				if (selected != null) {
    					instance.selectSegment(selected);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*instance, singleSelect, selected, previousSelected, segments*/ 41012) {
    			if (instance && !singleSelect) {
    				const setSelected = new Set(selected);
    				const unSelected = setDifference(previousSelected, setSelected);
    				const newSelected = setDifference(setSelected, previousSelected);

    				if (unSelected.size || newSelected.size) {
    					$$invalidate(15, previousSelected = setSelected);

    					for (let segmentId of unSelected) {
    						const idx = segments.indexOf(segmentId);

    						if (idx !== -1) {
    							instance.unselectSegment(idx);
    						}
    					}

    					for (let segmentId of newSelected) {
    						instance.selectSegment(segments.indexOf(segmentId));
    					}
    				}
    			}
    		}
    	};

    	return [
    		use,
    		className,
    		segments,
    		key,
    		singleSelect,
    		instance,
    		element,
    		forwardEvents,
    		initialSelected,
    		singleSelectStore,
    		handleSegmentMount,
    		handleSegmentUnmount,
    		$$restProps,
    		selected,
    		getElement,
    		previousSelected,
    		slots,
    		div_binding,
    		SMUISegmentedButtonSegment_mount_handler,
    		SMUISegmentedButtonSegment_unmount_handler,
    		selected_handler,
    		$$scope
    	];
    }

    class SegmentedButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance_1$3,
    			create_fragment$9,
    			safe_not_equal,
    			{
    				use: 0,
    				class: 1,
    				segments: 2,
    				key: 3,
    				singleSelect: 4,
    				selected: 13,
    				getElement: 14
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SegmentedButton",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get use() {
    		throw new Error("<SegmentedButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<SegmentedButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<SegmentedButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<SegmentedButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get segments() {
    		throw new Error("<SegmentedButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set segments(value) {
    		throw new Error("<SegmentedButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<SegmentedButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<SegmentedButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get singleSelect() {
    		throw new Error("<SegmentedButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set singleSelect(value) {
    		throw new Error("<SegmentedButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<SegmentedButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<SegmentedButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[14];
    	}

    	set getElement(value) {
    		throw new Error("<SegmentedButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * @license
     * Copyright 2020 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * Boolean strings for segment
     */
    var booleans = {
        TRUE: 'true',
        FALSE: 'false'
    };
    /**
     * Attributes referenced by segment
     */
    var attributes = {
        ARIA_CHECKED: 'aria-checked',
        ARIA_PRESSED: 'aria-pressed',
        DATA_SEGMENT_ID: 'data-segment-id'
    };
    /**
     * Style classes for segment
     */
    var cssClasses$2 = {
        SELECTED: 'mdc-segmented-button__segment--selected'
    };

    /**
     * @license
     * Copyright 2020 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var emptyClientRect = {
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
    };
    var MDCSegmentedButtonSegmentFoundation = /** @class */ (function (_super) {
        __extends(MDCSegmentedButtonSegmentFoundation, _super);
        function MDCSegmentedButtonSegmentFoundation(adapter) {
            return _super.call(this, __assign$1(__assign$1({}, MDCSegmentedButtonSegmentFoundation.defaultAdapter), adapter)) || this;
        }
        Object.defineProperty(MDCSegmentedButtonSegmentFoundation, "defaultAdapter", {
            get: function () {
                return {
                    isSingleSelect: function () { return false; }, getAttr: function () { return ''; }, setAttr: function () { return undefined; },
                    addClass: function () { return undefined; }, removeClass: function () { return undefined; },
                    hasClass: function () { return false; },
                    notifySelectedChange: function () { return undefined; },
                    getRootBoundingClientRect: function () { return emptyClientRect; },
                };
            },
            enumerable: false,
            configurable: true
        });
        /**
         * @return Returns true if segment is currently selected, otherwise returns
         * false
         */
        MDCSegmentedButtonSegmentFoundation.prototype.isSelected = function () {
            return this.adapter.hasClass(cssClasses$2.SELECTED);
        };
        /**
         * Sets segment to be selected
         */
        MDCSegmentedButtonSegmentFoundation.prototype.setSelected = function () {
            this.adapter.addClass(cssClasses$2.SELECTED);
            this.setAriaAttr(booleans.TRUE);
        };
        /**
         * Sets segment to be not selected
         */
        MDCSegmentedButtonSegmentFoundation.prototype.setUnselected = function () {
            this.adapter.removeClass(cssClasses$2.SELECTED);
            this.setAriaAttr(booleans.FALSE);
        };
        /**
         * @return Returns segment's segmentId if it was set by client
         */
        MDCSegmentedButtonSegmentFoundation.prototype.getSegmentId = function () {
            var _a;
            return (_a = this.adapter.getAttr(attributes.DATA_SEGMENT_ID)) !== null && _a !== void 0 ? _a : undefined;
        };
        /**
         * Called when segment is clicked. If the wrapping segmented button is single
         * select, doesn't allow segment to be set to not selected. Otherwise, toggles
         * segment's selected status. Finally, emits event to wrapping segmented
         * button.
         *
         * @event selected With detail - SegmentDetail
         */
        MDCSegmentedButtonSegmentFoundation.prototype.handleClick = function () {
            if (this.adapter.isSingleSelect()) {
                this.setSelected();
            }
            else {
                this.toggleSelection();
            }
            this.adapter.notifySelectedChange(this.isSelected());
        };
        /**
         * @return Returns bounding rectangle for ripple effect
         */
        MDCSegmentedButtonSegmentFoundation.prototype.getDimensions = function () {
            return this.adapter.getRootBoundingClientRect();
        };
        /**
         * Sets segment from not selected to selected, or selected to not selected
         */
        MDCSegmentedButtonSegmentFoundation.prototype.toggleSelection = function () {
            if (this.isSelected()) {
                this.setUnselected();
            }
            else {
                this.setSelected();
            }
        };
        /**
         * Sets appropriate aria attribute, based on wrapping segmented button's
         * single selected value, to new value
         *
         * @param value Value that represents selected status
         */
        MDCSegmentedButtonSegmentFoundation.prototype.setAriaAttr = function (value) {
            if (this.adapter.isSingleSelect()) {
                this.adapter.setAttr(attributes.ARIA_CHECKED, value);
            }
            else {
                this.adapter.setAttr(attributes.ARIA_PRESSED, value);
            }
        };
        return MDCSegmentedButtonSegmentFoundation;
    }(MDCFoundation));

    /* node_modules/@smui/segmented-button/dist/Segment.svelte generated by Svelte v3.46.4 */

    const { Error: Error_1 } = globals;
    const file$7 = "node_modules/@smui/segmented-button/dist/Segment.svelte";

    // (33:3) {#if ripple}
    function create_if_block_1$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "mdc-segmented-button__ripple");
    			add_location(div, file$7, 32, 15, 894);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(33:3) {#if ripple}",
    		ctx
    	});

    	return block;
    }

    // (34:4) {#if touch}
    function create_if_block$3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "mdc-segmented-button__segment__touch");
    			add_location(div, file$7, 33, 15, 964);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(34:4) {#if touch}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let button;
    	let if_block0_anchor;
    	let button_class_value;
    	let button_style_value;
    	let button_role_value;
    	let button_aria_pressed_value;
    	let button_aria_checked_value;
    	let Ripple_action;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*ripple*/ ctx[4] && create_if_block_1$1(ctx);
    	const default_slot_template = /*#slots*/ ctx[23].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[22], null);
    	let if_block1 = /*touch*/ ctx[5] && create_if_block$3(ctx);

    	let button_levels = [
    		{
    			class: button_class_value = classMap({
    				[/*className*/ ctx[2]]: true,
    				'mdc-segmented-button__segment': true,
    				'mdc-segmented-button__segment--touch': /*touch*/ ctx[5],
    				'mdc-segmented-button__segment--selected': /*selected*/ ctx[0],
    				.../*internalClasses*/ ctx[8]
    			})
    		},
    		{
    			style: button_style_value = Object.entries(/*internalStyles*/ ctx[9]).map(func$2).concat([/*style*/ ctx[3]]).join(' ')
    		},
    		{
    			role: button_role_value = /*singleSelect*/ ctx[14] ? 'radio' : undefined
    		},
    		{
    			"aria-pressed": button_aria_pressed_value = !/*singleSelect*/ ctx[14]
    			? /*selected*/ ctx[0] ? 'true' : 'false'
    			: undefined
    		},
    		{
    			"aria-checked": button_aria_checked_value = /*singleSelect*/ ctx[14]
    			? /*selected*/ ctx[0] ? 'true' : 'false'
    			: undefined
    		},
    		/*internalAttrs*/ ctx[10],
    		/*$$restProps*/ ctx[19]
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (if_block0) if_block0.c();
    			if_block0_anchor = empty();
    			if (default_slot) default_slot.c();
    			if (if_block1) if_block1.c();
    			set_attributes(button, button_data);
    			add_location(button, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			if (if_block0) if_block0.m(button, null);
    			append_dev(button, if_block0_anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (if_block1) if_block1.m(button, null);
    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[24](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(Ripple_action = Ripple.call(null, button, {
    						ripple: /*ripple*/ ctx[4],
    						unbounded: false,
    						addClass: /*addClass*/ ctx[16],
    						removeClass: /*removeClass*/ ctx[17],
    						addStyle: /*addStyle*/ ctx[18]
    					})),
    					action_destroyer(/*forwardEvents*/ ctx[11].call(null, button)),
    					action_destroyer(useActions_action = useActions.call(null, button, /*use*/ ctx[1])),
    					listen_dev(button, "click", /*click_handler*/ ctx[25], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*ripple*/ ctx[4]) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(button, if_block0_anchor);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 4194304)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[22],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[22])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[22], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*touch*/ ctx[5]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					if_block1.m(button, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				(!current || dirty[0] & /*className, touch, selected, internalClasses*/ 293 && button_class_value !== (button_class_value = classMap({
    					[/*className*/ ctx[2]]: true,
    					'mdc-segmented-button__segment': true,
    					'mdc-segmented-button__segment--touch': /*touch*/ ctx[5],
    					'mdc-segmented-button__segment--selected': /*selected*/ ctx[0],
    					.../*internalClasses*/ ctx[8]
    				}))) && { class: button_class_value },
    				(!current || dirty[0] & /*internalStyles, style*/ 520 && button_style_value !== (button_style_value = Object.entries(/*internalStyles*/ ctx[9]).map(func$2).concat([/*style*/ ctx[3]]).join(' '))) && { style: button_style_value },
    				{ role: button_role_value },
    				(!current || dirty[0] & /*selected*/ 1 && button_aria_pressed_value !== (button_aria_pressed_value = !/*singleSelect*/ ctx[14]
    				? /*selected*/ ctx[0] ? 'true' : 'false'
    				: undefined)) && {
    					"aria-pressed": button_aria_pressed_value
    				},
    				(!current || dirty[0] & /*selected*/ 1 && button_aria_checked_value !== (button_aria_checked_value = /*singleSelect*/ ctx[14]
    				? /*selected*/ ctx[0] ? 'true' : 'false'
    				: undefined)) && {
    					"aria-checked": button_aria_checked_value
    				},
    				dirty[0] & /*internalAttrs*/ 1024 && /*internalAttrs*/ ctx[10],
    				dirty[0] & /*$$restProps*/ 524288 && /*$$restProps*/ ctx[19]
    			]));

    			if (Ripple_action && is_function(Ripple_action.update) && dirty[0] & /*ripple*/ 16) Ripple_action.update.call(null, {
    				ripple: /*ripple*/ ctx[4],
    				unbounded: false,
    				addClass: /*addClass*/ ctx[16],
    				removeClass: /*removeClass*/ ctx[17],
    				addStyle: /*addStyle*/ ctx[18]
    			});

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*use*/ 2) useActions_action.update.call(null, /*use*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (if_block0) if_block0.d();
    			if (default_slot) default_slot.d(detaching);
    			if (if_block1) if_block1.d();
    			/*button_binding*/ ctx[24](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$2 = ([name, value]) => `${name}: ${value};`;

    function instance_1$2($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","style","segment","ripple","touch","selected","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $index;
    	let $singleSelect;
    	let $initialSelectedStore;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Segment', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());

    	let uninitializedValue = () => {
    		
    	};

    	function isUninitializedValue(value) {
    		return value === uninitializedValue;
    	}

    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
    	let { segment: segmentId } = $$props;
    	let { ripple = true } = $$props;
    	let { touch = false } = $$props;
    	const initialSelectedStore = getContext('SMUI:segmented-button:segment:initialSelected');
    	validate_store(initialSelectedStore, 'initialSelectedStore');
    	component_subscribe($$self, initialSelectedStore, value => $$invalidate(28, $initialSelectedStore = value));
    	let { selected = uninitializedValue } = $$props;
    	let manualSelection = !isUninitializedValue(selected);

    	if (isUninitializedValue(selected)) {
    		selected = $initialSelectedStore;
    	}

    	// Done with the trickery.
    	let element;

    	let instance;
    	let internalClasses = {};
    	let internalStyles = {};
    	let internalAttrs = {};
    	const singleSelect = getContext('SMUI:segmented-button:singleSelect');
    	validate_store(singleSelect, 'singleSelect');
    	component_subscribe($$self, singleSelect, value => $$invalidate(27, $singleSelect = value));
    	const index = getContext('SMUI:segmented-button:segment:index');
    	validate_store(index, 'index');
    	component_subscribe($$self, index, value => $$invalidate(26, $index = value));

    	if (!segmentId) {
    		throw new Error('The segment property is required! It should be passed down from the SegmentedButton to the Segment.');
    	}

    	onMount(() => {
    		$$invalidate(6, instance = new MDCSegmentedButtonSegmentFoundation({
    				isSingleSelect: () => {
    					return $singleSelect;
    				},
    				getAttr,
    				setAttr: addAttr,
    				addClass,
    				removeClass,
    				hasClass,
    				notifySelectedChange: value => {
    					$$invalidate(0, selected = value);
    					dispatch(getElement(), 'selected', { index: $index, selected, segmentId });
    				},
    				getRootBoundingClientRect: () => {
    					return getElement().getBoundingClientRect();
    				}
    			}));

    		const accessor = {
    			segmentId,
    			get selected() {
    				return selected;
    			},
    			set selected(value) {
    				if (selected !== value) {
    					$$invalidate(0, selected = value);
    				}
    			}
    		};

    		dispatch(getElement(), 'SMUISegmentedButtonSegment:mount', accessor);
    		instance.init();

    		return () => {
    			dispatch(getElement(), 'SMUISegmentedButtonSegment:unmount', accessor);
    			instance.destroy();
    		};
    	});

    	function hasClass(className) {
    		return className in internalClasses
    		? internalClasses[className]
    		: getElement().classList.contains(className);
    	}

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(8, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(8, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function getAttr(name) {
    		var _a;

    		return name in internalAttrs
    		? (_a = internalAttrs[name]) !== null && _a !== void 0
    			? _a
    			: null
    		: getElement().getAttribute(name);
    	}

    	function addAttr(name, value) {
    		if (internalAttrs[name] !== value) {
    			$$invalidate(10, internalAttrs[name] = value, internalAttrs);
    		}
    	}

    	function addStyle(name, value) {
    		if (internalStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete internalStyles[name];
    				$$invalidate(9, internalStyles);
    			} else {
    				$$invalidate(9, internalStyles[name] = value, internalStyles);
    			}
    		}
    	}

    	function getElement() {
    		return element;
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(7, element);
    		});
    	}

    	const click_handler = event => !event.defaultPrevented && instance && !manualSelection && instance.handleClick();

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(19, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ('segment' in $$new_props) $$invalidate(20, segmentId = $$new_props.segment);
    		if ('ripple' in $$new_props) $$invalidate(4, ripple = $$new_props.ripple);
    		if ('touch' in $$new_props) $$invalidate(5, touch = $$new_props.touch);
    		if ('selected' in $$new_props) $$invalidate(0, selected = $$new_props.selected);
    		if ('$$scope' in $$new_props) $$invalidate(22, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MDCSegmentedButtonSegmentFoundation,
    		onMount,
    		getContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		dispatch,
    		Ripple,
    		forwardEvents,
    		uninitializedValue,
    		isUninitializedValue,
    		use,
    		className,
    		style,
    		segmentId,
    		ripple,
    		touch,
    		initialSelectedStore,
    		selected,
    		manualSelection,
    		element,
    		instance,
    		internalClasses,
    		internalStyles,
    		internalAttrs,
    		singleSelect,
    		index,
    		hasClass,
    		addClass,
    		removeClass,
    		getAttr,
    		addAttr,
    		addStyle,
    		getElement,
    		$index,
    		$singleSelect,
    		$initialSelectedStore
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('uninitializedValue' in $$props) uninitializedValue = $$new_props.uninitializedValue;
    		if ('use' in $$props) $$invalidate(1, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(3, style = $$new_props.style);
    		if ('segmentId' in $$props) $$invalidate(20, segmentId = $$new_props.segmentId);
    		if ('ripple' in $$props) $$invalidate(4, ripple = $$new_props.ripple);
    		if ('touch' in $$props) $$invalidate(5, touch = $$new_props.touch);
    		if ('selected' in $$props) $$invalidate(0, selected = $$new_props.selected);
    		if ('manualSelection' in $$props) $$invalidate(13, manualSelection = $$new_props.manualSelection);
    		if ('element' in $$props) $$invalidate(7, element = $$new_props.element);
    		if ('instance' in $$props) $$invalidate(6, instance = $$new_props.instance);
    		if ('internalClasses' in $$props) $$invalidate(8, internalClasses = $$new_props.internalClasses);
    		if ('internalStyles' in $$props) $$invalidate(9, internalStyles = $$new_props.internalStyles);
    		if ('internalAttrs' in $$props) $$invalidate(10, internalAttrs = $$new_props.internalAttrs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*instance, selected*/ 65) {
    			if (instance && instance.isSelected() && !selected) {
    				instance.setUnselected();
    			}
    		}

    		if ($$self.$$.dirty[0] & /*instance, selected*/ 65) {
    			if (instance && !instance.isSelected() && selected) {
    				instance.setSelected();
    			}
    		}
    	};

    	return [
    		selected,
    		use,
    		className,
    		style,
    		ripple,
    		touch,
    		instance,
    		element,
    		internalClasses,
    		internalStyles,
    		internalAttrs,
    		forwardEvents,
    		initialSelectedStore,
    		manualSelection,
    		singleSelect,
    		index,
    		addClass,
    		removeClass,
    		addStyle,
    		$$restProps,
    		segmentId,
    		getElement,
    		$$scope,
    		slots,
    		button_binding,
    		click_handler
    	];
    }

    class Segment$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance_1$2,
    			create_fragment$8,
    			safe_not_equal,
    			{
    				use: 1,
    				class: 2,
    				style: 3,
    				segment: 20,
    				ripple: 4,
    				touch: 5,
    				selected: 0,
    				getElement: 21
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Segment",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*segmentId*/ ctx[20] === undefined && !('segment' in props)) {
    			console.warn("<Segment> was created without expected prop 'segment'");
    		}
    	}

    	get use() {
    		throw new Error_1("<Segment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error_1("<Segment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error_1("<Segment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error_1("<Segment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error_1("<Segment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error_1("<Segment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get segment() {
    		throw new Error_1("<Segment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set segment(value) {
    		throw new Error_1("<Segment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ripple() {
    		throw new Error_1("<Segment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ripple(value) {
    		throw new Error_1("<Segment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get touch() {
    		throw new Error_1("<Segment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set touch(value) {
    		throw new Error_1("<Segment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error_1("<Segment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error_1("<Segment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[21];
    	}

    	set getElement(value) {
    		throw new Error_1("<Segment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const Segment = Segment$1;

    const projectNameToProjectId = (projectName) => {
        if (projectName.toLowerCase().includes("vicodo")) {
            return "250558";
        }
        if (projectName.toLowerCase().includes("skyfld")) {
            return "250349";
        }
        return "";
    };
    const taskToTagId = (entryType) => {
        /*
              todo dodać tagi
              150932 - programming tag
              150935 - meeting
              199589 - estimations
              192818 - documentation
          */
        let tag = "150932";
        switch (entryType) {
            case 13582722: // meeting (wg harvesta)
                tag = "150935"; // meeting - teamdeck
            default:
                tag = "150932"; // programming - teamdeck
        }
        return tag;
    };
    const generateTeamdeckScriptFromHarvest = (res) => {
        return `
      const res = ${JSON.stringify(res)};
      res.map(entry => {
          fetch("https://app.teamdeck.io/api/walls/23765/time-entries", {
          "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "en,de;q=0.9,pl;q=0.8,en-US;q=0.7",
              "content-type": "application/json;charset=UTF-8",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin"
          },
          "referrer": "https://app.teamdeck.io/organizations/23765/calendar",
          "referrerPolicy": "strict-origin-when-cross-origin",
          "body": JSON.stringify( 
          {
              "minutes": entry.minutes,
              "description": entry.name.replace(/"/g, '\\"'),
              "project_id": [
                  entry.project
              ],
              "resource_id": [
                  278072
              ],
              "intervals": [
                  {
                      "start_date": entry.date,
                      "end_date": entry.date
                  }
              ],
              "weekend_booking": true,
              "holidays_booking": true,
              "vacations_booking": true,
              "tags": [{id: entry.tag, dataType: "tag"}]
          }),
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
          });
      })
      `;
    };

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var dayjs_min = createCommonjsModule(function (module, exports) {
    !function(t,e){module.exports=e();}(commonjsGlobal,(function(){var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",f="month",h="quarter",c="year",d="date",$="Invalid Date",l=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},m=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},g={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return -t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,f),s=n-i<0,u=e.clone().add(r+(s?-1:1),f);return +(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return {M:f,y:c,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:h}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},v="en",D={};D[v]=M;var p=function(t){return t instanceof _},S=function t(e,n,r){var i;if(!e)return v;if("string"==typeof e){var s=e.toLowerCase();D[s]&&(i=s),n&&(D[s]=n,i=s);var u=e.split("-");if(!i&&u.length>1)return t(u[0])}else {var a=e.name;D[a]=e,i=a;}return !r&&i&&(v=i),i||!r&&v},w=function(t,e){if(p(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},O=g;O.l=S,O.i=p,O.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=S(t.locale,null,!0),this.parse(t);}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(O.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(l);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init();},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},m.$utils=function(){return O},m.isValid=function(){return !(this.$d.toString()===$)},m.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return w(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<w(t)},m.$g=function(t,e,n){return O.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!O.u(e)||e,h=O.p(t),$=function(t,e){var i=O.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},l=function(t,e){return O.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,g="set"+(this.$u?"UTC":"");switch(h){case c:return r?$(1,0):$(31,11);case f:return r?$(1,M):$(0,M+1);case o:var v=this.$locale().weekStart||0,D=(y<v?y+7:y)-v;return $(r?m-D:m+(6-D),M);case a:case d:return l(g+"Hours",0);case u:return l(g+"Minutes",1);case s:return l(g+"Seconds",2);case i:return l(g+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=O.p(t),h="set"+(this.$u?"UTC":""),$=(n={},n[a]=h+"Date",n[d]=h+"Date",n[f]=h+"Month",n[c]=h+"FullYear",n[u]=h+"Hours",n[s]=h+"Minutes",n[i]=h+"Seconds",n[r]=h+"Milliseconds",n)[o],l=o===a?this.$D+(e-this.$W):e;if(o===f||o===c){var y=this.clone().set(d,1);y.$d[$](l),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d;}else $&&this.$d[$](l);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[O.p(t)]()},m.add=function(r,h){var d,$=this;r=Number(r);var l=O.p(h),y=function(t){var e=w($);return O.w(e.date(e.date()+Math.round(t*r)),$)};if(l===f)return this.set(f,this.$M+r);if(l===c)return this.set(c,this.$y+r);if(l===a)return y(1);if(l===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[l]||1,m=this.$d.getTime()+r*M;return O.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||$;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=O.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,f=n.months,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].substr(0,s)},c=function(t){return O.s(s%12||12,t,"0")},d=n.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:O.s(a+1,2,"0"),MMM:h(n.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:O.s(this.$D,2,"0"),d:String(this.$W),dd:h(n.weekdaysMin,this.$W,o,2),ddd:h(n.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:O.s(s,2,"0"),h:c(1),hh:c(2),a:d(s,u,!0),A:d(s,u,!1),m:String(u),mm:O.s(u,2,"0"),s:String(this.$s),ss:O.s(this.$s,2,"0"),SSS:O.s(this.$ms,3,"0"),Z:i};return r.replace(y,(function(t,e){return e||l[t]||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,$){var l,y=O.p(d),M=w(r),m=(M.utcOffset()-this.utcOffset())*e,g=this-M,v=O.m(this,M);return v=(l={},l[c]=v/12,l[f]=v,l[h]=v/3,l[o]=(g-m)/6048e5,l[a]=(g-m)/864e5,l[u]=g/n,l[s]=g/e,l[i]=g/t,l)[y]||g,$?v:O.a(v)},m.daysInMonth=function(){return this.endOf(f).$D},m.$locale=function(){return D[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=S(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return O.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),b=_.prototype;return w.prototype=b,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",f],["$y",c],["$D",d]].forEach((function(t){b[t[1]]=function(e){return this.$g(e,t[0],t[1])};})),w.extend=function(t,e){return t.$i||(t(e,_,w),t.$i=!0),w},w.locale=S,w.isDayjs=p,w.unix=function(t){return w(1e3*t)},w.en=D[v],w.Ls=D,w.p={},w}));
    });

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$1 = {
        ICON_BUTTON_ON: 'mdc-icon-button--on',
        ROOT: 'mdc-icon-button',
    };
    var strings$1 = {
        ARIA_LABEL: 'aria-label',
        ARIA_PRESSED: 'aria-pressed',
        DATA_ARIA_LABEL_OFF: 'data-aria-label-off',
        DATA_ARIA_LABEL_ON: 'data-aria-label-on',
        CHANGE_EVENT: 'MDCIconButtonToggle:change',
    };

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCIconButtonToggleFoundation = /** @class */ (function (_super) {
        __extends(MDCIconButtonToggleFoundation, _super);
        function MDCIconButtonToggleFoundation(adapter) {
            var _this = _super.call(this, __assign$1(__assign$1({}, MDCIconButtonToggleFoundation.defaultAdapter), adapter)) || this;
            /**
             * Whether the icon button has an aria label that changes depending on
             * toggled state.
             */
            _this.hasToggledAriaLabel = false;
            return _this;
        }
        Object.defineProperty(MDCIconButtonToggleFoundation, "cssClasses", {
            get: function () {
                return cssClasses$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCIconButtonToggleFoundation, "strings", {
            get: function () {
                return strings$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCIconButtonToggleFoundation, "defaultAdapter", {
            get: function () {
                return {
                    addClass: function () { return undefined; },
                    hasClass: function () { return false; },
                    notifyChange: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    getAttr: function () { return null; },
                    setAttr: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        MDCIconButtonToggleFoundation.prototype.init = function () {
            var ariaLabelOn = this.adapter.getAttr(strings$1.DATA_ARIA_LABEL_ON);
            var ariaLabelOff = this.adapter.getAttr(strings$1.DATA_ARIA_LABEL_OFF);
            if (ariaLabelOn && ariaLabelOff) {
                if (this.adapter.getAttr(strings$1.ARIA_PRESSED) !== null) {
                    throw new Error('MDCIconButtonToggleFoundation: Button should not set ' +
                        '`aria-pressed` if it has a toggled aria label.');
                }
                this.hasToggledAriaLabel = true;
            }
            else {
                this.adapter.setAttr(strings$1.ARIA_PRESSED, String(this.isOn()));
            }
        };
        MDCIconButtonToggleFoundation.prototype.handleClick = function () {
            this.toggle();
            this.adapter.notifyChange({ isOn: this.isOn() });
        };
        MDCIconButtonToggleFoundation.prototype.isOn = function () {
            return this.adapter.hasClass(cssClasses$1.ICON_BUTTON_ON);
        };
        MDCIconButtonToggleFoundation.prototype.toggle = function (isOn) {
            if (isOn === void 0) { isOn = !this.isOn(); }
            // Toggle UI based on state.
            if (isOn) {
                this.adapter.addClass(cssClasses$1.ICON_BUTTON_ON);
            }
            else {
                this.adapter.removeClass(cssClasses$1.ICON_BUTTON_ON);
            }
            // Toggle aria attributes based on state.
            if (this.hasToggledAriaLabel) {
                var ariaLabel = isOn ?
                    this.adapter.getAttr(strings$1.DATA_ARIA_LABEL_ON) :
                    this.adapter.getAttr(strings$1.DATA_ARIA_LABEL_OFF);
                this.adapter.setAttr(strings$1.ARIA_LABEL, ariaLabel || '');
            }
            else {
                this.adapter.setAttr(strings$1.ARIA_PRESSED, "" + isOn);
            }
        };
        return MDCIconButtonToggleFoundation;
    }(MDCFoundation));

    /* node_modules/@smui/icon-button/dist/IconButton.svelte generated by Svelte v3.46.4 */
    const file$6 = "node_modules/@smui/icon-button/dist/IconButton.svelte";

    // (61:10) {#if touch}
    function create_if_block$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "mdc-icon-button__touch");
    			add_location(div, file$6, 60, 21, 1955);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(61:10) {#if touch}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <svelte:component   this={component}   bind:this={element}   use={[     [       Ripple,       {         ripple,         unbounded: true,         color,         disabled: !!$$restProps.disabled,         addClass,         removeClass,         addStyle,       },     ],     forwardEvents,     ...use,   ]}   class={classMap({     [className]: true,     'mdc-icon-button': true,     'mdc-icon-button--on': !isUninitializedValue(pressed) && pressed,     'mdc-icon-button--touch': touch,     'mdc-icon-button--display-flex': displayFlex,     'smui-icon-button--size-button': size === 'button',     'mdc-icon-button--reduced-size': size === 'mini' || size === 'button',     'mdc-card__action': context === 'card:action',     'mdc-card__action--icon': context === 'card:action',     'mdc-top-app-bar__navigation-icon': context === 'top-app-bar:navigation',     'mdc-top-app-bar__action-item': context === 'top-app-bar:action',     'mdc-snackbar__dismiss': context === 'snackbar:actions',     'mdc-data-table__pagination-button': context === 'data-table:pagination',     'mdc-data-table__sort-icon-button':       context === 'data-table:sortable-header-cell',     'mdc-dialog__close': context === 'dialog:header' && action === 'close',     ...internalClasses,   })}   style={Object.entries(internalStyles)     .map(([name, value]) => `${name}: ${value};`)     .concat([style])     .join(' ')}   aria-pressed={!isUninitializedValue(pressed)     ? pressed       ? 'true'       : 'false'     : null}   aria-label={pressed ? ariaLabelOn : ariaLabelOff}   data-aria-label-on={ariaLabelOn}   data-aria-label-off={ariaLabelOff}   aria-describedby={ariaDescribedby}   on:click={() => instance && instance.handleClick()}   on:click={() =>     context === 'top-app-bar:navigation' &&     dispatch(getElement(), 'SMUITopAppBarIconButton:nav')}   {href}   {...actionProp}   {...internalAttrs}   {...$$restProps}   >
    function create_default_slot$2(ctx) {
    	let div;
    	let t;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[32].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[36], null);
    	let if_block = /*touch*/ ctx[8] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			if (default_slot) default_slot.c();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "class", "mdc-icon-button__ripple");
    			add_location(div, file$6, 59, 3, 1894);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[36],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[36])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[36], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*touch*/ ctx[8]) {
    				if (if_block) ; else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(1:0) <svelte:component   this={component}   bind:this={element}   use={[     [       Ripple,       {         ripple,         unbounded: true,         color,         disabled: !!$$restProps.disabled,         addClass,         removeClass,         addStyle,       },     ],     forwardEvents,     ...use,   ]}   class={classMap({     [className]: true,     'mdc-icon-button': true,     'mdc-icon-button--on': !isUninitializedValue(pressed) && pressed,     'mdc-icon-button--touch': touch,     'mdc-icon-button--display-flex': displayFlex,     'smui-icon-button--size-button': size === 'button',     'mdc-icon-button--reduced-size': size === 'mini' || size === 'button',     'mdc-card__action': context === 'card:action',     'mdc-card__action--icon': context === 'card:action',     'mdc-top-app-bar__navigation-icon': context === 'top-app-bar:navigation',     'mdc-top-app-bar__action-item': context === 'top-app-bar:action',     'mdc-snackbar__dismiss': context === 'snackbar:actions',     'mdc-data-table__pagination-button': context === 'data-table:pagination',     'mdc-data-table__sort-icon-button':       context === 'data-table:sortable-header-cell',     'mdc-dialog__close': context === 'dialog:header' && action === 'close',     ...internalClasses,   })}   style={Object.entries(internalStyles)     .map(([name, value]) => `${name}: ${value};`)     .concat([style])     .join(' ')}   aria-pressed={!isUninitializedValue(pressed)     ? pressed       ? 'true'       : 'false'     : null}   aria-label={pressed ? ariaLabelOn : ariaLabelOff}   data-aria-label-on={ariaLabelOn}   data-aria-label-off={ariaLabelOff}   aria-describedby={ariaDescribedby}   on:click={() => instance && instance.handleClick()}   on:click={() =>     context === 'top-app-bar:navigation' &&     dispatch(getElement(), 'SMUITopAppBarIconButton:nav')}   {href}   {...actionProp}   {...internalAttrs}   {...$$restProps}   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{
    			use: [
    				[
    					Ripple,
    					{
    						ripple: /*ripple*/ ctx[4],
    						unbounded: true,
    						color: /*color*/ ctx[5],
    						disabled: !!/*$$restProps*/ ctx[28].disabled,
    						addClass: /*addClass*/ ctx[25],
    						removeClass: /*removeClass*/ ctx[26],
    						addStyle: /*addStyle*/ ctx[27]
    					}
    				],
    				/*forwardEvents*/ ctx[21],
    				.../*use*/ ctx[1]
    			]
    		},
    		{
    			class: classMap({
    				[/*className*/ ctx[2]]: true,
    				'mdc-icon-button': true,
    				'mdc-icon-button--on': !/*isUninitializedValue*/ ctx[22](/*pressed*/ ctx[0]) && /*pressed*/ ctx[0],
    				'mdc-icon-button--touch': /*touch*/ ctx[8],
    				'mdc-icon-button--display-flex': /*displayFlex*/ ctx[9],
    				'smui-icon-button--size-button': /*size*/ ctx[10] === 'button',
    				'mdc-icon-button--reduced-size': /*size*/ ctx[10] === 'mini' || /*size*/ ctx[10] === 'button',
    				'mdc-card__action': /*context*/ ctx[23] === 'card:action',
    				'mdc-card__action--icon': /*context*/ ctx[23] === 'card:action',
    				'mdc-top-app-bar__navigation-icon': /*context*/ ctx[23] === 'top-app-bar:navigation',
    				'mdc-top-app-bar__action-item': /*context*/ ctx[23] === 'top-app-bar:action',
    				'mdc-snackbar__dismiss': /*context*/ ctx[23] === 'snackbar:actions',
    				'mdc-data-table__pagination-button': /*context*/ ctx[23] === 'data-table:pagination',
    				'mdc-data-table__sort-icon-button': /*context*/ ctx[23] === 'data-table:sortable-header-cell',
    				'mdc-dialog__close': /*context*/ ctx[23] === 'dialog:header' && /*action*/ ctx[12] === 'close',
    				.../*internalClasses*/ ctx[17]
    			})
    		},
    		{
    			style: Object.entries(/*internalStyles*/ ctx[18]).map(func$1).concat([/*style*/ ctx[3]]).join(' ')
    		},
    		{
    			"aria-pressed": !/*isUninitializedValue*/ ctx[22](/*pressed*/ ctx[0])
    			? /*pressed*/ ctx[0] ? 'true' : 'false'
    			: null
    		},
    		{
    			"aria-label": /*pressed*/ ctx[0]
    			? /*ariaLabelOn*/ ctx[6]
    			: /*ariaLabelOff*/ ctx[7]
    		},
    		{
    			"data-aria-label-on": /*ariaLabelOn*/ ctx[6]
    		},
    		{
    			"data-aria-label-off": /*ariaLabelOff*/ ctx[7]
    		},
    		{
    			"aria-describedby": /*ariaDescribedby*/ ctx[24]
    		},
    		{ href: /*href*/ ctx[11] },
    		/*actionProp*/ ctx[20],
    		/*internalAttrs*/ ctx[19],
    		/*$$restProps*/ ctx[28]
    	];

    	var switch_value = /*component*/ ctx[13];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot$2] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		/*switch_instance_binding*/ ctx[33](switch_instance);
    		switch_instance.$on("click", /*click_handler*/ ctx[34]);
    		switch_instance.$on("click", /*click_handler_1*/ ctx[35]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty[0] & /*ripple, color, $$restProps, addClass, removeClass, addStyle, forwardEvents, use, className, isUninitializedValue, pressed, touch, displayFlex, size, context, action, internalClasses, internalStyles, style, ariaLabelOn, ariaLabelOff, ariaDescribedby, href, actionProp, internalAttrs*/ 536748031)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty[0] & /*ripple, color, $$restProps, addClass, removeClass, addStyle, forwardEvents, use*/ 505413682 && {
    						use: [
    							[
    								Ripple,
    								{
    									ripple: /*ripple*/ ctx[4],
    									unbounded: true,
    									color: /*color*/ ctx[5],
    									disabled: !!/*$$restProps*/ ctx[28].disabled,
    									addClass: /*addClass*/ ctx[25],
    									removeClass: /*removeClass*/ ctx[26],
    									addStyle: /*addStyle*/ ctx[27]
    								}
    							],
    							/*forwardEvents*/ ctx[21],
    							.../*use*/ ctx[1]
    						]
    					},
    					dirty[0] & /*className, isUninitializedValue, pressed, touch, displayFlex, size, context, action, internalClasses*/ 12719877 && {
    						class: classMap({
    							[/*className*/ ctx[2]]: true,
    							'mdc-icon-button': true,
    							'mdc-icon-button--on': !/*isUninitializedValue*/ ctx[22](/*pressed*/ ctx[0]) && /*pressed*/ ctx[0],
    							'mdc-icon-button--touch': /*touch*/ ctx[8],
    							'mdc-icon-button--display-flex': /*displayFlex*/ ctx[9],
    							'smui-icon-button--size-button': /*size*/ ctx[10] === 'button',
    							'mdc-icon-button--reduced-size': /*size*/ ctx[10] === 'mini' || /*size*/ ctx[10] === 'button',
    							'mdc-card__action': /*context*/ ctx[23] === 'card:action',
    							'mdc-card__action--icon': /*context*/ ctx[23] === 'card:action',
    							'mdc-top-app-bar__navigation-icon': /*context*/ ctx[23] === 'top-app-bar:navigation',
    							'mdc-top-app-bar__action-item': /*context*/ ctx[23] === 'top-app-bar:action',
    							'mdc-snackbar__dismiss': /*context*/ ctx[23] === 'snackbar:actions',
    							'mdc-data-table__pagination-button': /*context*/ ctx[23] === 'data-table:pagination',
    							'mdc-data-table__sort-icon-button': /*context*/ ctx[23] === 'data-table:sortable-header-cell',
    							'mdc-dialog__close': /*context*/ ctx[23] === 'dialog:header' && /*action*/ ctx[12] === 'close',
    							.../*internalClasses*/ ctx[17]
    						})
    					},
    					dirty[0] & /*internalStyles, style*/ 262152 && {
    						style: Object.entries(/*internalStyles*/ ctx[18]).map(func$1).concat([/*style*/ ctx[3]]).join(' ')
    					},
    					dirty[0] & /*isUninitializedValue, pressed*/ 4194305 && {
    						"aria-pressed": !/*isUninitializedValue*/ ctx[22](/*pressed*/ ctx[0])
    						? /*pressed*/ ctx[0] ? 'true' : 'false'
    						: null
    					},
    					dirty[0] & /*pressed, ariaLabelOn, ariaLabelOff*/ 193 && {
    						"aria-label": /*pressed*/ ctx[0]
    						? /*ariaLabelOn*/ ctx[6]
    						: /*ariaLabelOff*/ ctx[7]
    					},
    					dirty[0] & /*ariaLabelOn*/ 64 && {
    						"data-aria-label-on": /*ariaLabelOn*/ ctx[6]
    					},
    					dirty[0] & /*ariaLabelOff*/ 128 && {
    						"data-aria-label-off": /*ariaLabelOff*/ ctx[7]
    					},
    					dirty[0] & /*ariaDescribedby*/ 16777216 && {
    						"aria-describedby": /*ariaDescribedby*/ ctx[24]
    					},
    					dirty[0] & /*href*/ 2048 && { href: /*href*/ ctx[11] },
    					dirty[0] & /*actionProp*/ 1048576 && get_spread_object(/*actionProp*/ ctx[20]),
    					dirty[0] & /*internalAttrs*/ 524288 && get_spread_object(/*internalAttrs*/ ctx[19]),
    					dirty[0] & /*$$restProps*/ 268435456 && get_spread_object(/*$$restProps*/ ctx[28])
    				])
    			: {};

    			if (dirty[0] & /*touch*/ 256 | dirty[1] & /*$$scope*/ 32) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*component*/ ctx[13])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					/*switch_instance_binding*/ ctx[33](switch_instance);
    					switch_instance.$on("click", /*click_handler*/ ctx[34]);
    					switch_instance.$on("click", /*click_handler_1*/ ctx[35]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*switch_instance_binding*/ ctx[33](null);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$1 = ([name, value]) => `${name}: ${value};`;

    function instance_1$1($$self, $$props, $$invalidate) {
    	let actionProp;

    	const omit_props_names = [
    		"use","class","style","ripple","color","toggle","pressed","ariaLabelOn","ariaLabelOff","touch","displayFlex","size","href","action","component","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconButton', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());

    	let uninitializedValue = () => {
    		
    	};

    	function isUninitializedValue(value) {
    		return value === uninitializedValue;
    	}

    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
    	let { ripple = true } = $$props;
    	let { color = undefined } = $$props;
    	let { toggle = false } = $$props;
    	let { pressed = uninitializedValue } = $$props;
    	let { ariaLabelOn = undefined } = $$props;
    	let { ariaLabelOff = undefined } = $$props;
    	let { touch = false } = $$props;
    	let { displayFlex = true } = $$props;
    	let { size = 'normal' } = $$props;
    	let { href = undefined } = $$props;
    	let { action = undefined } = $$props;
    	let element;
    	let instance;
    	let internalClasses = {};
    	let internalStyles = {};
    	let internalAttrs = {};
    	let context = getContext('SMUI:icon-button:context');
    	let ariaDescribedby = getContext('SMUI:icon-button:aria-describedby');
    	let { component = href == null ? Button : A } = $$props;
    	let previousDisabled = $$restProps.disabled;
    	setContext('SMUI:icon:context', 'icon-button');
    	let oldToggle = null;

    	onDestroy(() => {
    		instance && instance.destroy();
    	});

    	function hasClass(className) {
    		return className in internalClasses
    		? internalClasses[className]
    		: getElement().classList.contains(className);
    	}

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(17, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(17, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addStyle(name, value) {
    		if (internalStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete internalStyles[name];
    				$$invalidate(18, internalStyles);
    			} else {
    				$$invalidate(18, internalStyles[name] = value, internalStyles);
    			}
    		}
    	}

    	function getAttr(name) {
    		var _a;

    		return name in internalAttrs
    		? (_a = internalAttrs[name]) !== null && _a !== void 0
    			? _a
    			: null
    		: getElement().getAttribute(name);
    	}

    	function addAttr(name, value) {
    		if (internalAttrs[name] !== value) {
    			$$invalidate(19, internalAttrs[name] = value, internalAttrs);
    		}
    	}

    	function handleChange(evtData) {
    		$$invalidate(0, pressed = evtData.isOn);
    	}

    	function getElement() {
    		return element.getElement();
    	}

    	function switch_instance_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(15, element);
    		});
    	}

    	const click_handler = () => instance && instance.handleClick();
    	const click_handler_1 = () => context === 'top-app-bar:navigation' && dispatch(getElement(), 'SMUITopAppBarIconButton:nav');

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(28, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ('ripple' in $$new_props) $$invalidate(4, ripple = $$new_props.ripple);
    		if ('color' in $$new_props) $$invalidate(5, color = $$new_props.color);
    		if ('toggle' in $$new_props) $$invalidate(29, toggle = $$new_props.toggle);
    		if ('pressed' in $$new_props) $$invalidate(0, pressed = $$new_props.pressed);
    		if ('ariaLabelOn' in $$new_props) $$invalidate(6, ariaLabelOn = $$new_props.ariaLabelOn);
    		if ('ariaLabelOff' in $$new_props) $$invalidate(7, ariaLabelOff = $$new_props.ariaLabelOff);
    		if ('touch' in $$new_props) $$invalidate(8, touch = $$new_props.touch);
    		if ('displayFlex' in $$new_props) $$invalidate(9, displayFlex = $$new_props.displayFlex);
    		if ('size' in $$new_props) $$invalidate(10, size = $$new_props.size);
    		if ('href' in $$new_props) $$invalidate(11, href = $$new_props.href);
    		if ('action' in $$new_props) $$invalidate(12, action = $$new_props.action);
    		if ('component' in $$new_props) $$invalidate(13, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(36, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MDCIconButtonToggleFoundation,
    		onDestroy,
    		getContext,
    		setContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		dispatch,
    		Ripple,
    		A,
    		Button,
    		forwardEvents,
    		uninitializedValue,
    		isUninitializedValue,
    		use,
    		className,
    		style,
    		ripple,
    		color,
    		toggle,
    		pressed,
    		ariaLabelOn,
    		ariaLabelOff,
    		touch,
    		displayFlex,
    		size,
    		href,
    		action,
    		element,
    		instance,
    		internalClasses,
    		internalStyles,
    		internalAttrs,
    		context,
    		ariaDescribedby,
    		component,
    		previousDisabled,
    		oldToggle,
    		hasClass,
    		addClass,
    		removeClass,
    		addStyle,
    		getAttr,
    		addAttr,
    		handleChange,
    		getElement,
    		actionProp
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('uninitializedValue' in $$props) uninitializedValue = $$new_props.uninitializedValue;
    		if ('use' in $$props) $$invalidate(1, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(3, style = $$new_props.style);
    		if ('ripple' in $$props) $$invalidate(4, ripple = $$new_props.ripple);
    		if ('color' in $$props) $$invalidate(5, color = $$new_props.color);
    		if ('toggle' in $$props) $$invalidate(29, toggle = $$new_props.toggle);
    		if ('pressed' in $$props) $$invalidate(0, pressed = $$new_props.pressed);
    		if ('ariaLabelOn' in $$props) $$invalidate(6, ariaLabelOn = $$new_props.ariaLabelOn);
    		if ('ariaLabelOff' in $$props) $$invalidate(7, ariaLabelOff = $$new_props.ariaLabelOff);
    		if ('touch' in $$props) $$invalidate(8, touch = $$new_props.touch);
    		if ('displayFlex' in $$props) $$invalidate(9, displayFlex = $$new_props.displayFlex);
    		if ('size' in $$props) $$invalidate(10, size = $$new_props.size);
    		if ('href' in $$props) $$invalidate(11, href = $$new_props.href);
    		if ('action' in $$props) $$invalidate(12, action = $$new_props.action);
    		if ('element' in $$props) $$invalidate(15, element = $$new_props.element);
    		if ('instance' in $$props) $$invalidate(16, instance = $$new_props.instance);
    		if ('internalClasses' in $$props) $$invalidate(17, internalClasses = $$new_props.internalClasses);
    		if ('internalStyles' in $$props) $$invalidate(18, internalStyles = $$new_props.internalStyles);
    		if ('internalAttrs' in $$props) $$invalidate(19, internalAttrs = $$new_props.internalAttrs);
    		if ('context' in $$props) $$invalidate(23, context = $$new_props.context);
    		if ('ariaDescribedby' in $$props) $$invalidate(24, ariaDescribedby = $$new_props.ariaDescribedby);
    		if ('component' in $$props) $$invalidate(13, component = $$new_props.component);
    		if ('previousDisabled' in $$props) $$invalidate(30, previousDisabled = $$new_props.previousDisabled);
    		if ('oldToggle' in $$props) $$invalidate(31, oldToggle = $$new_props.oldToggle);
    		if ('actionProp' in $$props) $$invalidate(20, actionProp = $$new_props.actionProp);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*action*/ 4096) {
    			$$invalidate(20, actionProp = (() => {
    				if (context === 'data-table:pagination') {
    					switch (action) {
    						case 'first-page':
    							return { 'data-first-page': 'true' };
    						case 'prev-page':
    							return { 'data-prev-page': 'true' };
    						case 'next-page':
    							return { 'data-next-page': 'true' };
    						case 'last-page':
    							return { 'data-last-page': 'true' };
    						default:
    							return { 'data-action': 'true' };
    					}
    				} else if (context === 'dialog:header') {
    					return { 'data-mdc-dialog-action': action };
    				} else {
    					return { action };
    				}
    			})());
    		}

    		if (previousDisabled !== $$restProps.disabled) {
    			const elem = getElement();

    			if ('blur' in elem) {
    				elem.blur();
    			}

    			$$invalidate(30, previousDisabled = $$restProps.disabled);
    		}

    		if ($$self.$$.dirty[0] & /*element, toggle, instance*/ 536969216 | $$self.$$.dirty[1] & /*oldToggle*/ 1) {
    			if (element && getElement() && toggle !== oldToggle) {
    				if (toggle && !instance) {
    					$$invalidate(16, instance = new MDCIconButtonToggleFoundation({
    							addClass,
    							hasClass,
    							notifyChange: evtData => {
    								handleChange(evtData);
    								dispatch(getElement(), 'SMUIIconButtonToggle:change', evtData, undefined, true);
    							},
    							removeClass,
    							getAttr,
    							setAttr: addAttr
    						}));

    					instance.init();
    				} else if (!toggle && instance) {
    					instance.destroy();
    					$$invalidate(16, instance = undefined);
    					$$invalidate(17, internalClasses = {});
    					$$invalidate(19, internalAttrs = {});
    				}

    				$$invalidate(31, oldToggle = toggle);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*instance, pressed*/ 65537) {
    			if (instance && !isUninitializedValue(pressed) && instance.isOn() !== pressed) {
    				instance.toggle(pressed);
    			}
    		}
    	};

    	return [
    		pressed,
    		use,
    		className,
    		style,
    		ripple,
    		color,
    		ariaLabelOn,
    		ariaLabelOff,
    		touch,
    		displayFlex,
    		size,
    		href,
    		action,
    		component,
    		getElement,
    		element,
    		instance,
    		internalClasses,
    		internalStyles,
    		internalAttrs,
    		actionProp,
    		forwardEvents,
    		isUninitializedValue,
    		context,
    		ariaDescribedby,
    		addClass,
    		removeClass,
    		addStyle,
    		$$restProps,
    		toggle,
    		previousDisabled,
    		oldToggle,
    		slots,
    		switch_instance_binding,
    		click_handler,
    		click_handler_1,
    		$$scope
    	];
    }

    class IconButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance_1$1,
    			create_fragment$7,
    			safe_not_equal,
    			{
    				use: 1,
    				class: 2,
    				style: 3,
    				ripple: 4,
    				color: 5,
    				toggle: 29,
    				pressed: 0,
    				ariaLabelOn: 6,
    				ariaLabelOff: 7,
    				touch: 8,
    				displayFlex: 9,
    				size: 10,
    				href: 11,
    				action: 12,
    				component: 13,
    				getElement: 14
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconButton",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get use() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ripple() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ripple(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggle() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggle(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pressed() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pressed(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabelOn() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabelOn(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabelOff() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabelOff(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get touch() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set touch(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get displayFlex() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set displayFlex(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get action() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set action(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[14];
    	}

    	set getElement(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var HOOKS = [
        "onChange",
        "onClose",
        "onDayCreate",
        "onDestroy",
        "onKeyDown",
        "onMonthChange",
        "onOpen",
        "onParseConfig",
        "onReady",
        "onValueUpdate",
        "onYearChange",
        "onPreCalendarPosition",
    ];
    var defaults = {
        _disable: [],
        allowInput: false,
        allowInvalidPreload: false,
        altFormat: "F j, Y",
        altInput: false,
        altInputClass: "form-control input",
        animate: typeof window === "object" &&
            window.navigator.userAgent.indexOf("MSIE") === -1,
        ariaDateFormat: "F j, Y",
        autoFillDefaultTime: true,
        clickOpens: true,
        closeOnSelect: true,
        conjunction: ", ",
        dateFormat: "Y-m-d",
        defaultHour: 12,
        defaultMinute: 0,
        defaultSeconds: 0,
        disable: [],
        disableMobile: false,
        enableSeconds: false,
        enableTime: false,
        errorHandler: function (err) {
            return typeof console !== "undefined" && console.warn(err);
        },
        getWeek: function (givenDate) {
            var date = new Date(givenDate.getTime());
            date.setHours(0, 0, 0, 0);
            date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
            var week1 = new Date(date.getFullYear(), 0, 4);
            return (1 +
                Math.round(((date.getTime() - week1.getTime()) / 86400000 -
                    3 +
                    ((week1.getDay() + 6) % 7)) /
                    7));
        },
        hourIncrement: 1,
        ignoredFocusElements: [],
        inline: false,
        locale: "default",
        minuteIncrement: 5,
        mode: "single",
        monthSelectorType: "dropdown",
        nextArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",
        noCalendar: false,
        now: new Date(),
        onChange: [],
        onClose: [],
        onDayCreate: [],
        onDestroy: [],
        onKeyDown: [],
        onMonthChange: [],
        onOpen: [],
        onParseConfig: [],
        onReady: [],
        onValueUpdate: [],
        onYearChange: [],
        onPreCalendarPosition: [],
        plugins: [],
        position: "auto",
        positionElement: undefined,
        prevArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",
        shorthandCurrentMonth: false,
        showMonths: 1,
        static: false,
        time_24hr: false,
        weekNumbers: false,
        wrap: false,
    };

    var english = {
        weekdays: {
            shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            longhand: [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ],
        },
        months: {
            shorthand: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
            longhand: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ],
        },
        daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        firstDayOfWeek: 0,
        ordinal: function (nth) {
            var s = nth % 100;
            if (s > 3 && s < 21)
                return "th";
            switch (s % 10) {
                case 1:
                    return "st";
                case 2:
                    return "nd";
                case 3:
                    return "rd";
                default:
                    return "th";
            }
        },
        rangeSeparator: " to ",
        weekAbbreviation: "Wk",
        scrollTitle: "Scroll to increment",
        toggleTitle: "Click to toggle",
        amPM: ["AM", "PM"],
        yearAriaLabel: "Year",
        monthAriaLabel: "Month",
        hourAriaLabel: "Hour",
        minuteAriaLabel: "Minute",
        time_24hr: false,
    };

    var pad = function (number, length) {
        if (length === void 0) { length = 2; }
        return ("000" + number).slice(length * -1);
    };
    var int = function (bool) { return (bool === true ? 1 : 0); };
    function debounce(fn, wait) {
        var t;
        return function () {
            var _this = this;
            var args = arguments;
            clearTimeout(t);
            t = setTimeout(function () { return fn.apply(_this, args); }, wait);
        };
    }
    var arrayify = function (obj) {
        return obj instanceof Array ? obj : [obj];
    };

    function toggleClass(elem, className, bool) {
        if (bool === true)
            return elem.classList.add(className);
        elem.classList.remove(className);
    }
    function createElement(tag, className, content) {
        var e = window.document.createElement(tag);
        className = className || "";
        content = content || "";
        e.className = className;
        if (content !== undefined)
            e.textContent = content;
        return e;
    }
    function clearNode(node) {
        while (node.firstChild)
            node.removeChild(node.firstChild);
    }
    function findParent(node, condition) {
        if (condition(node))
            return node;
        else if (node.parentNode)
            return findParent(node.parentNode, condition);
        return undefined;
    }
    function createNumberInput(inputClassName, opts) {
        var wrapper = createElement("div", "numInputWrapper"), numInput = createElement("input", "numInput " + inputClassName), arrowUp = createElement("span", "arrowUp"), arrowDown = createElement("span", "arrowDown");
        if (navigator.userAgent.indexOf("MSIE 9.0") === -1) {
            numInput.type = "number";
        }
        else {
            numInput.type = "text";
            numInput.pattern = "\\d*";
        }
        if (opts !== undefined)
            for (var key in opts)
                numInput.setAttribute(key, opts[key]);
        wrapper.appendChild(numInput);
        wrapper.appendChild(arrowUp);
        wrapper.appendChild(arrowDown);
        return wrapper;
    }
    function getEventTarget(event) {
        try {
            if (typeof event.composedPath === "function") {
                var path = event.composedPath();
                return path[0];
            }
            return event.target;
        }
        catch (error) {
            return event.target;
        }
    }

    var doNothing = function () { return undefined; };
    var monthToStr = function (monthNumber, shorthand, locale) { return locale.months[shorthand ? "shorthand" : "longhand"][monthNumber]; };
    var revFormat = {
        D: doNothing,
        F: function (dateObj, monthName, locale) {
            dateObj.setMonth(locale.months.longhand.indexOf(monthName));
        },
        G: function (dateObj, hour) {
            dateObj.setHours((dateObj.getHours() >= 12 ? 12 : 0) + parseFloat(hour));
        },
        H: function (dateObj, hour) {
            dateObj.setHours(parseFloat(hour));
        },
        J: function (dateObj, day) {
            dateObj.setDate(parseFloat(day));
        },
        K: function (dateObj, amPM, locale) {
            dateObj.setHours((dateObj.getHours() % 12) +
                12 * int(new RegExp(locale.amPM[1], "i").test(amPM)));
        },
        M: function (dateObj, shortMonth, locale) {
            dateObj.setMonth(locale.months.shorthand.indexOf(shortMonth));
        },
        S: function (dateObj, seconds) {
            dateObj.setSeconds(parseFloat(seconds));
        },
        U: function (_, unixSeconds) { return new Date(parseFloat(unixSeconds) * 1000); },
        W: function (dateObj, weekNum, locale) {
            var weekNumber = parseInt(weekNum);
            var date = new Date(dateObj.getFullYear(), 0, 2 + (weekNumber - 1) * 7, 0, 0, 0, 0);
            date.setDate(date.getDate() - date.getDay() + locale.firstDayOfWeek);
            return date;
        },
        Y: function (dateObj, year) {
            dateObj.setFullYear(parseFloat(year));
        },
        Z: function (_, ISODate) { return new Date(ISODate); },
        d: function (dateObj, day) {
            dateObj.setDate(parseFloat(day));
        },
        h: function (dateObj, hour) {
            dateObj.setHours((dateObj.getHours() >= 12 ? 12 : 0) + parseFloat(hour));
        },
        i: function (dateObj, minutes) {
            dateObj.setMinutes(parseFloat(minutes));
        },
        j: function (dateObj, day) {
            dateObj.setDate(parseFloat(day));
        },
        l: doNothing,
        m: function (dateObj, month) {
            dateObj.setMonth(parseFloat(month) - 1);
        },
        n: function (dateObj, month) {
            dateObj.setMonth(parseFloat(month) - 1);
        },
        s: function (dateObj, seconds) {
            dateObj.setSeconds(parseFloat(seconds));
        },
        u: function (_, unixMillSeconds) {
            return new Date(parseFloat(unixMillSeconds));
        },
        w: doNothing,
        y: function (dateObj, year) {
            dateObj.setFullYear(2000 + parseFloat(year));
        },
    };
    var tokenRegex = {
        D: "",
        F: "",
        G: "(\\d\\d|\\d)",
        H: "(\\d\\d|\\d)",
        J: "(\\d\\d|\\d)\\w+",
        K: "",
        M: "",
        S: "(\\d\\d|\\d)",
        U: "(.+)",
        W: "(\\d\\d|\\d)",
        Y: "(\\d{4})",
        Z: "(.+)",
        d: "(\\d\\d|\\d)",
        h: "(\\d\\d|\\d)",
        i: "(\\d\\d|\\d)",
        j: "(\\d\\d|\\d)",
        l: "",
        m: "(\\d\\d|\\d)",
        n: "(\\d\\d|\\d)",
        s: "(\\d\\d|\\d)",
        u: "(.+)",
        w: "(\\d\\d|\\d)",
        y: "(\\d{2})",
    };
    var formats = {
        Z: function (date) { return date.toISOString(); },
        D: function (date, locale, options) {
            return locale.weekdays.shorthand[formats.w(date, locale, options)];
        },
        F: function (date, locale, options) {
            return monthToStr(formats.n(date, locale, options) - 1, false, locale);
        },
        G: function (date, locale, options) {
            return pad(formats.h(date, locale, options));
        },
        H: function (date) { return pad(date.getHours()); },
        J: function (date, locale) {
            return locale.ordinal !== undefined
                ? date.getDate() + locale.ordinal(date.getDate())
                : date.getDate();
        },
        K: function (date, locale) { return locale.amPM[int(date.getHours() > 11)]; },
        M: function (date, locale) {
            return monthToStr(date.getMonth(), true, locale);
        },
        S: function (date) { return pad(date.getSeconds()); },
        U: function (date) { return date.getTime() / 1000; },
        W: function (date, _, options) {
            return options.getWeek(date);
        },
        Y: function (date) { return pad(date.getFullYear(), 4); },
        d: function (date) { return pad(date.getDate()); },
        h: function (date) { return (date.getHours() % 12 ? date.getHours() % 12 : 12); },
        i: function (date) { return pad(date.getMinutes()); },
        j: function (date) { return date.getDate(); },
        l: function (date, locale) {
            return locale.weekdays.longhand[date.getDay()];
        },
        m: function (date) { return pad(date.getMonth() + 1); },
        n: function (date) { return date.getMonth() + 1; },
        s: function (date) { return date.getSeconds(); },
        u: function (date) { return date.getTime(); },
        w: function (date) { return date.getDay(); },
        y: function (date) { return String(date.getFullYear()).substring(2); },
    };

    var createDateFormatter = function (_a) {
        var _b = _a.config, config = _b === void 0 ? defaults : _b, _c = _a.l10n, l10n = _c === void 0 ? english : _c, _d = _a.isMobile, isMobile = _d === void 0 ? false : _d;
        return function (dateObj, frmt, overrideLocale) {
            var locale = overrideLocale || l10n;
            if (config.formatDate !== undefined && !isMobile) {
                return config.formatDate(dateObj, frmt, locale);
            }
            return frmt
                .split("")
                .map(function (c, i, arr) {
                return formats[c] && arr[i - 1] !== "\\"
                    ? formats[c](dateObj, locale, config)
                    : c !== "\\"
                        ? c
                        : "";
            })
                .join("");
        };
    };
    var createDateParser = function (_a) {
        var _b = _a.config, config = _b === void 0 ? defaults : _b, _c = _a.l10n, l10n = _c === void 0 ? english : _c;
        return function (date, givenFormat, timeless, customLocale) {
            if (date !== 0 && !date)
                return undefined;
            var locale = customLocale || l10n;
            var parsedDate;
            var dateOrig = date;
            if (date instanceof Date)
                parsedDate = new Date(date.getTime());
            else if (typeof date !== "string" &&
                date.toFixed !== undefined)
                parsedDate = new Date(date);
            else if (typeof date === "string") {
                var format = givenFormat || (config || defaults).dateFormat;
                var datestr = String(date).trim();
                if (datestr === "today") {
                    parsedDate = new Date();
                    timeless = true;
                }
                else if (config && config.parseDate) {
                    parsedDate = config.parseDate(date, format);
                }
                else if (/Z$/.test(datestr) ||
                    /GMT$/.test(datestr)) {
                    parsedDate = new Date(date);
                }
                else {
                    var matched = void 0, ops = [];
                    for (var i = 0, matchIndex = 0, regexStr = ""; i < format.length; i++) {
                        var token = format[i];
                        var isBackSlash = token === "\\";
                        var escaped = format[i - 1] === "\\" || isBackSlash;
                        if (tokenRegex[token] && !escaped) {
                            regexStr += tokenRegex[token];
                            var match = new RegExp(regexStr).exec(date);
                            if (match && (matched = true)) {
                                ops[token !== "Y" ? "push" : "unshift"]({
                                    fn: revFormat[token],
                                    val: match[++matchIndex],
                                });
                            }
                        }
                        else if (!isBackSlash)
                            regexStr += ".";
                    }
                    parsedDate =
                        !config || !config.noCalendar
                            ? new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0)
                            : new Date(new Date().setHours(0, 0, 0, 0));
                    ops.forEach(function (_a) {
                        var fn = _a.fn, val = _a.val;
                        return (parsedDate = fn(parsedDate, val, locale) || parsedDate);
                    });
                    parsedDate = matched ? parsedDate : undefined;
                }
            }
            if (!(parsedDate instanceof Date && !isNaN(parsedDate.getTime()))) {
                config.errorHandler(new Error("Invalid date provided: " + dateOrig));
                return undefined;
            }
            if (timeless === true)
                parsedDate.setHours(0, 0, 0, 0);
            return parsedDate;
        };
    };
    function compareDates(date1, date2, timeless) {
        if (timeless === void 0) { timeless = true; }
        if (timeless !== false) {
            return (new Date(date1.getTime()).setHours(0, 0, 0, 0) -
                new Date(date2.getTime()).setHours(0, 0, 0, 0));
        }
        return date1.getTime() - date2.getTime();
    }
    var isBetween = function (ts, ts1, ts2) {
        return ts > Math.min(ts1, ts2) && ts < Math.max(ts1, ts2);
    };
    var calculateSecondsSinceMidnight = function (hours, minutes, seconds) {
        return hours * 3600 + minutes * 60 + seconds;
    };
    var parseSeconds = function (secondsSinceMidnight) {
        var hours = Math.floor(secondsSinceMidnight / 3600), minutes = (secondsSinceMidnight - hours * 3600) / 60;
        return [hours, minutes, secondsSinceMidnight - hours * 3600 - minutes * 60];
    };
    var duration = {
        DAY: 86400000,
    };
    function getDefaultHours(config) {
        var hours = config.defaultHour;
        var minutes = config.defaultMinute;
        var seconds = config.defaultSeconds;
        if (config.minDate !== undefined) {
            var minHour = config.minDate.getHours();
            var minMinutes = config.minDate.getMinutes();
            var minSeconds = config.minDate.getSeconds();
            if (hours < minHour) {
                hours = minHour;
            }
            if (hours === minHour && minutes < minMinutes) {
                minutes = minMinutes;
            }
            if (hours === minHour && minutes === minMinutes && seconds < minSeconds)
                seconds = config.minDate.getSeconds();
        }
        if (config.maxDate !== undefined) {
            var maxHr = config.maxDate.getHours();
            var maxMinutes = config.maxDate.getMinutes();
            hours = Math.min(hours, maxHr);
            if (hours === maxHr)
                minutes = Math.min(maxMinutes, minutes);
            if (hours === maxHr && minutes === maxMinutes)
                seconds = config.maxDate.getSeconds();
        }
        return { hours: hours, minutes: minutes, seconds: seconds };
    }

    if (typeof Object.assign !== "function") {
        Object.assign = function (target) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!target) {
                throw TypeError("Cannot convert undefined or null to object");
            }
            var _loop_1 = function (source) {
                if (source) {
                    Object.keys(source).forEach(function (key) { return (target[key] = source[key]); });
                }
            };
            for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
                var source = args_1[_a];
                _loop_1(source);
            }
            return target;
        };
    }

    var __assign = (undefined && undefined.__assign) || function () {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };
    var DEBOUNCED_CHANGE_MS = 300;
    function FlatpickrInstance(element, instanceConfig) {
        var self = {
            config: __assign(__assign({}, defaults), flatpickr.defaultConfig),
            l10n: english,
        };
        self.parseDate = createDateParser({ config: self.config, l10n: self.l10n });
        self._handlers = [];
        self.pluginElements = [];
        self.loadedPlugins = [];
        self._bind = bind;
        self._setHoursFromDate = setHoursFromDate;
        self._positionCalendar = positionCalendar;
        self.changeMonth = changeMonth;
        self.changeYear = changeYear;
        self.clear = clear;
        self.close = close;
        self.onMouseOver = onMouseOver;
        self._createElement = createElement;
        self.createDay = createDay;
        self.destroy = destroy;
        self.isEnabled = isEnabled;
        self.jumpToDate = jumpToDate;
        self.updateValue = updateValue;
        self.open = open;
        self.redraw = redraw;
        self.set = set;
        self.setDate = setDate;
        self.toggle = toggle;
        function setupHelperFunctions() {
            self.utils = {
                getDaysInMonth: function (month, yr) {
                    if (month === void 0) { month = self.currentMonth; }
                    if (yr === void 0) { yr = self.currentYear; }
                    if (month === 1 && ((yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0))
                        return 29;
                    return self.l10n.daysInMonth[month];
                },
            };
        }
        function init() {
            self.element = self.input = element;
            self.isOpen = false;
            parseConfig();
            setupLocale();
            setupInputs();
            setupDates();
            setupHelperFunctions();
            if (!self.isMobile)
                build();
            bindEvents();
            if (self.selectedDates.length || self.config.noCalendar) {
                if (self.config.enableTime) {
                    setHoursFromDate(self.config.noCalendar ? self.latestSelectedDateObj : undefined);
                }
                updateValue(false);
            }
            setCalendarWidth();
            var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            if (!self.isMobile && isSafari) {
                positionCalendar();
            }
            triggerEvent("onReady");
        }
        function getClosestActiveElement() {
            var _a;
            return ((_a = self.calendarContainer) === null || _a === void 0 ? void 0 : _a.getRootNode()).activeElement || document.activeElement;
        }
        function bindToInstance(fn) {
            return fn.bind(self);
        }
        function setCalendarWidth() {
            var config = self.config;
            if (config.weekNumbers === false && config.showMonths === 1) {
                return;
            }
            else if (config.noCalendar !== true) {
                window.requestAnimationFrame(function () {
                    if (self.calendarContainer !== undefined) {
                        self.calendarContainer.style.visibility = "hidden";
                        self.calendarContainer.style.display = "block";
                    }
                    if (self.daysContainer !== undefined) {
                        var daysWidth = (self.days.offsetWidth + 1) * config.showMonths;
                        self.daysContainer.style.width = daysWidth + "px";
                        self.calendarContainer.style.width =
                            daysWidth +
                                (self.weekWrapper !== undefined
                                    ? self.weekWrapper.offsetWidth
                                    : 0) +
                                "px";
                        self.calendarContainer.style.removeProperty("visibility");
                        self.calendarContainer.style.removeProperty("display");
                    }
                });
            }
        }
        function updateTime(e) {
            if (self.selectedDates.length === 0) {
                var defaultDate = self.config.minDate === undefined ||
                    compareDates(new Date(), self.config.minDate) >= 0
                    ? new Date()
                    : new Date(self.config.minDate.getTime());
                var defaults = getDefaultHours(self.config);
                defaultDate.setHours(defaults.hours, defaults.minutes, defaults.seconds, defaultDate.getMilliseconds());
                self.selectedDates = [defaultDate];
                self.latestSelectedDateObj = defaultDate;
            }
            if (e !== undefined && e.type !== "blur") {
                timeWrapper(e);
            }
            var prevValue = self._input.value;
            setHoursFromInputs();
            updateValue();
            if (self._input.value !== prevValue) {
                self._debouncedChange();
            }
        }
        function ampm2military(hour, amPM) {
            return (hour % 12) + 12 * int(amPM === self.l10n.amPM[1]);
        }
        function military2ampm(hour) {
            switch (hour % 24) {
                case 0:
                case 12:
                    return 12;
                default:
                    return hour % 12;
            }
        }
        function setHoursFromInputs() {
            if (self.hourElement === undefined || self.minuteElement === undefined)
                return;
            var hours = (parseInt(self.hourElement.value.slice(-2), 10) || 0) % 24, minutes = (parseInt(self.minuteElement.value, 10) || 0) % 60, seconds = self.secondElement !== undefined
                ? (parseInt(self.secondElement.value, 10) || 0) % 60
                : 0;
            if (self.amPM !== undefined) {
                hours = ampm2military(hours, self.amPM.textContent);
            }
            var limitMinHours = self.config.minTime !== undefined ||
                (self.config.minDate &&
                    self.minDateHasTime &&
                    self.latestSelectedDateObj &&
                    compareDates(self.latestSelectedDateObj, self.config.minDate, true) ===
                        0);
            var limitMaxHours = self.config.maxTime !== undefined ||
                (self.config.maxDate &&
                    self.maxDateHasTime &&
                    self.latestSelectedDateObj &&
                    compareDates(self.latestSelectedDateObj, self.config.maxDate, true) ===
                        0);
            if (self.config.maxTime !== undefined &&
                self.config.minTime !== undefined &&
                self.config.minTime > self.config.maxTime) {
                var minBound = calculateSecondsSinceMidnight(self.config.minTime.getHours(), self.config.minTime.getMinutes(), self.config.minTime.getSeconds());
                var maxBound = calculateSecondsSinceMidnight(self.config.maxTime.getHours(), self.config.maxTime.getMinutes(), self.config.maxTime.getSeconds());
                var currentTime = calculateSecondsSinceMidnight(hours, minutes, seconds);
                if (currentTime > maxBound && currentTime < minBound) {
                    var result = parseSeconds(minBound);
                    hours = result[0];
                    minutes = result[1];
                    seconds = result[2];
                }
            }
            else {
                if (limitMaxHours) {
                    var maxTime = self.config.maxTime !== undefined
                        ? self.config.maxTime
                        : self.config.maxDate;
                    hours = Math.min(hours, maxTime.getHours());
                    if (hours === maxTime.getHours())
                        minutes = Math.min(minutes, maxTime.getMinutes());
                    if (minutes === maxTime.getMinutes())
                        seconds = Math.min(seconds, maxTime.getSeconds());
                }
                if (limitMinHours) {
                    var minTime = self.config.minTime !== undefined
                        ? self.config.minTime
                        : self.config.minDate;
                    hours = Math.max(hours, minTime.getHours());
                    if (hours === minTime.getHours() && minutes < minTime.getMinutes())
                        minutes = minTime.getMinutes();
                    if (minutes === minTime.getMinutes())
                        seconds = Math.max(seconds, minTime.getSeconds());
                }
            }
            setHours(hours, minutes, seconds);
        }
        function setHoursFromDate(dateObj) {
            var date = dateObj || self.latestSelectedDateObj;
            if (date && date instanceof Date) {
                setHours(date.getHours(), date.getMinutes(), date.getSeconds());
            }
        }
        function setHours(hours, minutes, seconds) {
            if (self.latestSelectedDateObj !== undefined) {
                self.latestSelectedDateObj.setHours(hours % 24, minutes, seconds || 0, 0);
            }
            if (!self.hourElement || !self.minuteElement || self.isMobile)
                return;
            self.hourElement.value = pad(!self.config.time_24hr
                ? ((12 + hours) % 12) + 12 * int(hours % 12 === 0)
                : hours);
            self.minuteElement.value = pad(minutes);
            if (self.amPM !== undefined)
                self.amPM.textContent = self.l10n.amPM[int(hours >= 12)];
            if (self.secondElement !== undefined)
                self.secondElement.value = pad(seconds);
        }
        function onYearInput(event) {
            var eventTarget = getEventTarget(event);
            var year = parseInt(eventTarget.value) + (event.delta || 0);
            if (year / 1000 > 1 ||
                (event.key === "Enter" && !/[^\d]/.test(year.toString()))) {
                changeYear(year);
            }
        }
        function bind(element, event, handler, options) {
            if (event instanceof Array)
                return event.forEach(function (ev) { return bind(element, ev, handler, options); });
            if (element instanceof Array)
                return element.forEach(function (el) { return bind(el, event, handler, options); });
            element.addEventListener(event, handler, options);
            self._handlers.push({
                remove: function () { return element.removeEventListener(event, handler, options); },
            });
        }
        function triggerChange() {
            triggerEvent("onChange");
        }
        function bindEvents() {
            if (self.config.wrap) {
                ["open", "close", "toggle", "clear"].forEach(function (evt) {
                    Array.prototype.forEach.call(self.element.querySelectorAll("[data-" + evt + "]"), function (el) {
                        return bind(el, "click", self[evt]);
                    });
                });
            }
            if (self.isMobile) {
                setupMobile();
                return;
            }
            var debouncedResize = debounce(onResize, 50);
            self._debouncedChange = debounce(triggerChange, DEBOUNCED_CHANGE_MS);
            if (self.daysContainer && !/iPhone|iPad|iPod/i.test(navigator.userAgent))
                bind(self.daysContainer, "mouseover", function (e) {
                    if (self.config.mode === "range")
                        onMouseOver(getEventTarget(e));
                });
            bind(self._input, "keydown", onKeyDown);
            if (self.calendarContainer !== undefined) {
                bind(self.calendarContainer, "keydown", onKeyDown);
            }
            if (!self.config.inline && !self.config.static)
                bind(window, "resize", debouncedResize);
            if (window.ontouchstart !== undefined)
                bind(window.document, "touchstart", documentClick);
            else
                bind(window.document, "mousedown", documentClick);
            bind(window.document, "focus", documentClick, { capture: true });
            if (self.config.clickOpens === true) {
                bind(self._input, "focus", self.open);
                bind(self._input, "click", self.open);
            }
            if (self.daysContainer !== undefined) {
                bind(self.monthNav, "click", onMonthNavClick);
                bind(self.monthNav, ["keyup", "increment"], onYearInput);
                bind(self.daysContainer, "click", selectDate);
            }
            if (self.timeContainer !== undefined &&
                self.minuteElement !== undefined &&
                self.hourElement !== undefined) {
                var selText = function (e) {
                    return getEventTarget(e).select();
                };
                bind(self.timeContainer, ["increment"], updateTime);
                bind(self.timeContainer, "blur", updateTime, { capture: true });
                bind(self.timeContainer, "click", timeIncrement);
                bind([self.hourElement, self.minuteElement], ["focus", "click"], selText);
                if (self.secondElement !== undefined)
                    bind(self.secondElement, "focus", function () { return self.secondElement && self.secondElement.select(); });
                if (self.amPM !== undefined) {
                    bind(self.amPM, "click", function (e) {
                        updateTime(e);
                    });
                }
            }
            if (self.config.allowInput) {
                bind(self._input, "blur", onBlur);
            }
        }
        function jumpToDate(jumpDate, triggerChange) {
            var jumpTo = jumpDate !== undefined
                ? self.parseDate(jumpDate)
                : self.latestSelectedDateObj ||
                    (self.config.minDate && self.config.minDate > self.now
                        ? self.config.minDate
                        : self.config.maxDate && self.config.maxDate < self.now
                            ? self.config.maxDate
                            : self.now);
            var oldYear = self.currentYear;
            var oldMonth = self.currentMonth;
            try {
                if (jumpTo !== undefined) {
                    self.currentYear = jumpTo.getFullYear();
                    self.currentMonth = jumpTo.getMonth();
                }
            }
            catch (e) {
                e.message = "Invalid date supplied: " + jumpTo;
                self.config.errorHandler(e);
            }
            if (triggerChange && self.currentYear !== oldYear) {
                triggerEvent("onYearChange");
                buildMonthSwitch();
            }
            if (triggerChange &&
                (self.currentYear !== oldYear || self.currentMonth !== oldMonth)) {
                triggerEvent("onMonthChange");
            }
            self.redraw();
        }
        function timeIncrement(e) {
            var eventTarget = getEventTarget(e);
            if (~eventTarget.className.indexOf("arrow"))
                incrementNumInput(e, eventTarget.classList.contains("arrowUp") ? 1 : -1);
        }
        function incrementNumInput(e, delta, inputElem) {
            var target = e && getEventTarget(e);
            var input = inputElem ||
                (target && target.parentNode && target.parentNode.firstChild);
            var event = createEvent("increment");
            event.delta = delta;
            input && input.dispatchEvent(event);
        }
        function build() {
            var fragment = window.document.createDocumentFragment();
            self.calendarContainer = createElement("div", "flatpickr-calendar");
            self.calendarContainer.tabIndex = -1;
            if (!self.config.noCalendar) {
                fragment.appendChild(buildMonthNav());
                self.innerContainer = createElement("div", "flatpickr-innerContainer");
                if (self.config.weekNumbers) {
                    var _a = buildWeeks(), weekWrapper = _a.weekWrapper, weekNumbers = _a.weekNumbers;
                    self.innerContainer.appendChild(weekWrapper);
                    self.weekNumbers = weekNumbers;
                    self.weekWrapper = weekWrapper;
                }
                self.rContainer = createElement("div", "flatpickr-rContainer");
                self.rContainer.appendChild(buildWeekdays());
                if (!self.daysContainer) {
                    self.daysContainer = createElement("div", "flatpickr-days");
                    self.daysContainer.tabIndex = -1;
                }
                buildDays();
                self.rContainer.appendChild(self.daysContainer);
                self.innerContainer.appendChild(self.rContainer);
                fragment.appendChild(self.innerContainer);
            }
            if (self.config.enableTime) {
                fragment.appendChild(buildTime());
            }
            toggleClass(self.calendarContainer, "rangeMode", self.config.mode === "range");
            toggleClass(self.calendarContainer, "animate", self.config.animate === true);
            toggleClass(self.calendarContainer, "multiMonth", self.config.showMonths > 1);
            self.calendarContainer.appendChild(fragment);
            var customAppend = self.config.appendTo !== undefined &&
                self.config.appendTo.nodeType !== undefined;
            if (self.config.inline || self.config.static) {
                self.calendarContainer.classList.add(self.config.inline ? "inline" : "static");
                if (self.config.inline) {
                    if (!customAppend && self.element.parentNode)
                        self.element.parentNode.insertBefore(self.calendarContainer, self._input.nextSibling);
                    else if (self.config.appendTo !== undefined)
                        self.config.appendTo.appendChild(self.calendarContainer);
                }
                if (self.config.static) {
                    var wrapper = createElement("div", "flatpickr-wrapper");
                    if (self.element.parentNode)
                        self.element.parentNode.insertBefore(wrapper, self.element);
                    wrapper.appendChild(self.element);
                    if (self.altInput)
                        wrapper.appendChild(self.altInput);
                    wrapper.appendChild(self.calendarContainer);
                }
            }
            if (!self.config.static && !self.config.inline)
                (self.config.appendTo !== undefined
                    ? self.config.appendTo
                    : window.document.body).appendChild(self.calendarContainer);
        }
        function createDay(className, date, dayNumber, i) {
            var dateIsEnabled = isEnabled(date, true), dayElement = createElement("span", className, date.getDate().toString());
            dayElement.dateObj = date;
            dayElement.$i = i;
            dayElement.setAttribute("aria-label", self.formatDate(date, self.config.ariaDateFormat));
            if (className.indexOf("hidden") === -1 &&
                compareDates(date, self.now) === 0) {
                self.todayDateElem = dayElement;
                dayElement.classList.add("today");
                dayElement.setAttribute("aria-current", "date");
            }
            if (dateIsEnabled) {
                dayElement.tabIndex = -1;
                if (isDateSelected(date)) {
                    dayElement.classList.add("selected");
                    self.selectedDateElem = dayElement;
                    if (self.config.mode === "range") {
                        toggleClass(dayElement, "startRange", self.selectedDates[0] &&
                            compareDates(date, self.selectedDates[0], true) === 0);
                        toggleClass(dayElement, "endRange", self.selectedDates[1] &&
                            compareDates(date, self.selectedDates[1], true) === 0);
                        if (className === "nextMonthDay")
                            dayElement.classList.add("inRange");
                    }
                }
            }
            else {
                dayElement.classList.add("flatpickr-disabled");
            }
            if (self.config.mode === "range") {
                if (isDateInRange(date) && !isDateSelected(date))
                    dayElement.classList.add("inRange");
            }
            if (self.weekNumbers &&
                self.config.showMonths === 1 &&
                className !== "prevMonthDay" &&
                dayNumber % 7 === 1) {
                self.weekNumbers.insertAdjacentHTML("beforeend", "<span class='flatpickr-day'>" + self.config.getWeek(date) + "</span>");
            }
            triggerEvent("onDayCreate", dayElement);
            return dayElement;
        }
        function focusOnDayElem(targetNode) {
            targetNode.focus();
            if (self.config.mode === "range")
                onMouseOver(targetNode);
        }
        function getFirstAvailableDay(delta) {
            var startMonth = delta > 0 ? 0 : self.config.showMonths - 1;
            var endMonth = delta > 0 ? self.config.showMonths : -1;
            for (var m = startMonth; m != endMonth; m += delta) {
                var month = self.daysContainer.children[m];
                var startIndex = delta > 0 ? 0 : month.children.length - 1;
                var endIndex = delta > 0 ? month.children.length : -1;
                for (var i = startIndex; i != endIndex; i += delta) {
                    var c = month.children[i];
                    if (c.className.indexOf("hidden") === -1 && isEnabled(c.dateObj))
                        return c;
                }
            }
            return undefined;
        }
        function getNextAvailableDay(current, delta) {
            var givenMonth = current.className.indexOf("Month") === -1
                ? current.dateObj.getMonth()
                : self.currentMonth;
            var endMonth = delta > 0 ? self.config.showMonths : -1;
            var loopDelta = delta > 0 ? 1 : -1;
            for (var m = givenMonth - self.currentMonth; m != endMonth; m += loopDelta) {
                var month = self.daysContainer.children[m];
                var startIndex = givenMonth - self.currentMonth === m
                    ? current.$i + delta
                    : delta < 0
                        ? month.children.length - 1
                        : 0;
                var numMonthDays = month.children.length;
                for (var i = startIndex; i >= 0 && i < numMonthDays && i != (delta > 0 ? numMonthDays : -1); i += loopDelta) {
                    var c = month.children[i];
                    if (c.className.indexOf("hidden") === -1 &&
                        isEnabled(c.dateObj) &&
                        Math.abs(current.$i - i) >= Math.abs(delta))
                        return focusOnDayElem(c);
                }
            }
            self.changeMonth(loopDelta);
            focusOnDay(getFirstAvailableDay(loopDelta), 0);
            return undefined;
        }
        function focusOnDay(current, offset) {
            var activeElement = getClosestActiveElement();
            var dayFocused = isInView(activeElement || document.body);
            var startElem = current !== undefined
                ? current
                : dayFocused
                    ? activeElement
                    : self.selectedDateElem !== undefined && isInView(self.selectedDateElem)
                        ? self.selectedDateElem
                        : self.todayDateElem !== undefined && isInView(self.todayDateElem)
                            ? self.todayDateElem
                            : getFirstAvailableDay(offset > 0 ? 1 : -1);
            if (startElem === undefined) {
                self._input.focus();
            }
            else if (!dayFocused) {
                focusOnDayElem(startElem);
            }
            else {
                getNextAvailableDay(startElem, offset);
            }
        }
        function buildMonthDays(year, month) {
            var firstOfMonth = (new Date(year, month, 1).getDay() - self.l10n.firstDayOfWeek + 7) % 7;
            var prevMonthDays = self.utils.getDaysInMonth((month - 1 + 12) % 12, year);
            var daysInMonth = self.utils.getDaysInMonth(month, year), days = window.document.createDocumentFragment(), isMultiMonth = self.config.showMonths > 1, prevMonthDayClass = isMultiMonth ? "prevMonthDay hidden" : "prevMonthDay", nextMonthDayClass = isMultiMonth ? "nextMonthDay hidden" : "nextMonthDay";
            var dayNumber = prevMonthDays + 1 - firstOfMonth, dayIndex = 0;
            for (; dayNumber <= prevMonthDays; dayNumber++, dayIndex++) {
                days.appendChild(createDay("flatpickr-day " + prevMonthDayClass, new Date(year, month - 1, dayNumber), dayNumber, dayIndex));
            }
            for (dayNumber = 1; dayNumber <= daysInMonth; dayNumber++, dayIndex++) {
                days.appendChild(createDay("flatpickr-day", new Date(year, month, dayNumber), dayNumber, dayIndex));
            }
            for (var dayNum = daysInMonth + 1; dayNum <= 42 - firstOfMonth &&
                (self.config.showMonths === 1 || dayIndex % 7 !== 0); dayNum++, dayIndex++) {
                days.appendChild(createDay("flatpickr-day " + nextMonthDayClass, new Date(year, month + 1, dayNum % daysInMonth), dayNum, dayIndex));
            }
            var dayContainer = createElement("div", "dayContainer");
            dayContainer.appendChild(days);
            return dayContainer;
        }
        function buildDays() {
            if (self.daysContainer === undefined) {
                return;
            }
            clearNode(self.daysContainer);
            if (self.weekNumbers)
                clearNode(self.weekNumbers);
            var frag = document.createDocumentFragment();
            for (var i = 0; i < self.config.showMonths; i++) {
                var d = new Date(self.currentYear, self.currentMonth, 1);
                d.setMonth(self.currentMonth + i);
                frag.appendChild(buildMonthDays(d.getFullYear(), d.getMonth()));
            }
            self.daysContainer.appendChild(frag);
            self.days = self.daysContainer.firstChild;
            if (self.config.mode === "range" && self.selectedDates.length === 1) {
                onMouseOver();
            }
        }
        function buildMonthSwitch() {
            if (self.config.showMonths > 1 ||
                self.config.monthSelectorType !== "dropdown")
                return;
            var shouldBuildMonth = function (month) {
                if (self.config.minDate !== undefined &&
                    self.currentYear === self.config.minDate.getFullYear() &&
                    month < self.config.minDate.getMonth()) {
                    return false;
                }
                return !(self.config.maxDate !== undefined &&
                    self.currentYear === self.config.maxDate.getFullYear() &&
                    month > self.config.maxDate.getMonth());
            };
            self.monthsDropdownContainer.tabIndex = -1;
            self.monthsDropdownContainer.innerHTML = "";
            for (var i = 0; i < 12; i++) {
                if (!shouldBuildMonth(i))
                    continue;
                var month = createElement("option", "flatpickr-monthDropdown-month");
                month.value = new Date(self.currentYear, i).getMonth().toString();
                month.textContent = monthToStr(i, self.config.shorthandCurrentMonth, self.l10n);
                month.tabIndex = -1;
                if (self.currentMonth === i) {
                    month.selected = true;
                }
                self.monthsDropdownContainer.appendChild(month);
            }
        }
        function buildMonth() {
            var container = createElement("div", "flatpickr-month");
            var monthNavFragment = window.document.createDocumentFragment();
            var monthElement;
            if (self.config.showMonths > 1 ||
                self.config.monthSelectorType === "static") {
                monthElement = createElement("span", "cur-month");
            }
            else {
                self.monthsDropdownContainer = createElement("select", "flatpickr-monthDropdown-months");
                self.monthsDropdownContainer.setAttribute("aria-label", self.l10n.monthAriaLabel);
                bind(self.monthsDropdownContainer, "change", function (e) {
                    var target = getEventTarget(e);
                    var selectedMonth = parseInt(target.value, 10);
                    self.changeMonth(selectedMonth - self.currentMonth);
                    triggerEvent("onMonthChange");
                });
                buildMonthSwitch();
                monthElement = self.monthsDropdownContainer;
            }
            var yearInput = createNumberInput("cur-year", { tabindex: "-1" });
            var yearElement = yearInput.getElementsByTagName("input")[0];
            yearElement.setAttribute("aria-label", self.l10n.yearAriaLabel);
            if (self.config.minDate) {
                yearElement.setAttribute("min", self.config.minDate.getFullYear().toString());
            }
            if (self.config.maxDate) {
                yearElement.setAttribute("max", self.config.maxDate.getFullYear().toString());
                yearElement.disabled =
                    !!self.config.minDate &&
                        self.config.minDate.getFullYear() === self.config.maxDate.getFullYear();
            }
            var currentMonth = createElement("div", "flatpickr-current-month");
            currentMonth.appendChild(monthElement);
            currentMonth.appendChild(yearInput);
            monthNavFragment.appendChild(currentMonth);
            container.appendChild(monthNavFragment);
            return {
                container: container,
                yearElement: yearElement,
                monthElement: monthElement,
            };
        }
        function buildMonths() {
            clearNode(self.monthNav);
            self.monthNav.appendChild(self.prevMonthNav);
            if (self.config.showMonths) {
                self.yearElements = [];
                self.monthElements = [];
            }
            for (var m = self.config.showMonths; m--;) {
                var month = buildMonth();
                self.yearElements.push(month.yearElement);
                self.monthElements.push(month.monthElement);
                self.monthNav.appendChild(month.container);
            }
            self.monthNav.appendChild(self.nextMonthNav);
        }
        function buildMonthNav() {
            self.monthNav = createElement("div", "flatpickr-months");
            self.yearElements = [];
            self.monthElements = [];
            self.prevMonthNav = createElement("span", "flatpickr-prev-month");
            self.prevMonthNav.innerHTML = self.config.prevArrow;
            self.nextMonthNav = createElement("span", "flatpickr-next-month");
            self.nextMonthNav.innerHTML = self.config.nextArrow;
            buildMonths();
            Object.defineProperty(self, "_hidePrevMonthArrow", {
                get: function () { return self.__hidePrevMonthArrow; },
                set: function (bool) {
                    if (self.__hidePrevMonthArrow !== bool) {
                        toggleClass(self.prevMonthNav, "flatpickr-disabled", bool);
                        self.__hidePrevMonthArrow = bool;
                    }
                },
            });
            Object.defineProperty(self, "_hideNextMonthArrow", {
                get: function () { return self.__hideNextMonthArrow; },
                set: function (bool) {
                    if (self.__hideNextMonthArrow !== bool) {
                        toggleClass(self.nextMonthNav, "flatpickr-disabled", bool);
                        self.__hideNextMonthArrow = bool;
                    }
                },
            });
            self.currentYearElement = self.yearElements[0];
            updateNavigationCurrentMonth();
            return self.monthNav;
        }
        function buildTime() {
            self.calendarContainer.classList.add("hasTime");
            if (self.config.noCalendar)
                self.calendarContainer.classList.add("noCalendar");
            var defaults = getDefaultHours(self.config);
            self.timeContainer = createElement("div", "flatpickr-time");
            self.timeContainer.tabIndex = -1;
            var separator = createElement("span", "flatpickr-time-separator", ":");
            var hourInput = createNumberInput("flatpickr-hour", {
                "aria-label": self.l10n.hourAriaLabel,
            });
            self.hourElement = hourInput.getElementsByTagName("input")[0];
            var minuteInput = createNumberInput("flatpickr-minute", {
                "aria-label": self.l10n.minuteAriaLabel,
            });
            self.minuteElement = minuteInput.getElementsByTagName("input")[0];
            self.hourElement.tabIndex = self.minuteElement.tabIndex = -1;
            self.hourElement.value = pad(self.latestSelectedDateObj
                ? self.latestSelectedDateObj.getHours()
                : self.config.time_24hr
                    ? defaults.hours
                    : military2ampm(defaults.hours));
            self.minuteElement.value = pad(self.latestSelectedDateObj
                ? self.latestSelectedDateObj.getMinutes()
                : defaults.minutes);
            self.hourElement.setAttribute("step", self.config.hourIncrement.toString());
            self.minuteElement.setAttribute("step", self.config.minuteIncrement.toString());
            self.hourElement.setAttribute("min", self.config.time_24hr ? "0" : "1");
            self.hourElement.setAttribute("max", self.config.time_24hr ? "23" : "12");
            self.hourElement.setAttribute("maxlength", "2");
            self.minuteElement.setAttribute("min", "0");
            self.minuteElement.setAttribute("max", "59");
            self.minuteElement.setAttribute("maxlength", "2");
            self.timeContainer.appendChild(hourInput);
            self.timeContainer.appendChild(separator);
            self.timeContainer.appendChild(minuteInput);
            if (self.config.time_24hr)
                self.timeContainer.classList.add("time24hr");
            if (self.config.enableSeconds) {
                self.timeContainer.classList.add("hasSeconds");
                var secondInput = createNumberInput("flatpickr-second");
                self.secondElement = secondInput.getElementsByTagName("input")[0];
                self.secondElement.value = pad(self.latestSelectedDateObj
                    ? self.latestSelectedDateObj.getSeconds()
                    : defaults.seconds);
                self.secondElement.setAttribute("step", self.minuteElement.getAttribute("step"));
                self.secondElement.setAttribute("min", "0");
                self.secondElement.setAttribute("max", "59");
                self.secondElement.setAttribute("maxlength", "2");
                self.timeContainer.appendChild(createElement("span", "flatpickr-time-separator", ":"));
                self.timeContainer.appendChild(secondInput);
            }
            if (!self.config.time_24hr) {
                self.amPM = createElement("span", "flatpickr-am-pm", self.l10n.amPM[int((self.latestSelectedDateObj
                    ? self.hourElement.value
                    : self.config.defaultHour) > 11)]);
                self.amPM.title = self.l10n.toggleTitle;
                self.amPM.tabIndex = -1;
                self.timeContainer.appendChild(self.amPM);
            }
            return self.timeContainer;
        }
        function buildWeekdays() {
            if (!self.weekdayContainer)
                self.weekdayContainer = createElement("div", "flatpickr-weekdays");
            else
                clearNode(self.weekdayContainer);
            for (var i = self.config.showMonths; i--;) {
                var container = createElement("div", "flatpickr-weekdaycontainer");
                self.weekdayContainer.appendChild(container);
            }
            updateWeekdays();
            return self.weekdayContainer;
        }
        function updateWeekdays() {
            if (!self.weekdayContainer) {
                return;
            }
            var firstDayOfWeek = self.l10n.firstDayOfWeek;
            var weekdays = __spreadArrays(self.l10n.weekdays.shorthand);
            if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
                weekdays = __spreadArrays(weekdays.splice(firstDayOfWeek, weekdays.length), weekdays.splice(0, firstDayOfWeek));
            }
            for (var i = self.config.showMonths; i--;) {
                self.weekdayContainer.children[i].innerHTML = "\n      <span class='flatpickr-weekday'>\n        " + weekdays.join("</span><span class='flatpickr-weekday'>") + "\n      </span>\n      ";
            }
        }
        function buildWeeks() {
            self.calendarContainer.classList.add("hasWeeks");
            var weekWrapper = createElement("div", "flatpickr-weekwrapper");
            weekWrapper.appendChild(createElement("span", "flatpickr-weekday", self.l10n.weekAbbreviation));
            var weekNumbers = createElement("div", "flatpickr-weeks");
            weekWrapper.appendChild(weekNumbers);
            return {
                weekWrapper: weekWrapper,
                weekNumbers: weekNumbers,
            };
        }
        function changeMonth(value, isOffset) {
            if (isOffset === void 0) { isOffset = true; }
            var delta = isOffset ? value : value - self.currentMonth;
            if ((delta < 0 && self._hidePrevMonthArrow === true) ||
                (delta > 0 && self._hideNextMonthArrow === true))
                return;
            self.currentMonth += delta;
            if (self.currentMonth < 0 || self.currentMonth > 11) {
                self.currentYear += self.currentMonth > 11 ? 1 : -1;
                self.currentMonth = (self.currentMonth + 12) % 12;
                triggerEvent("onYearChange");
                buildMonthSwitch();
            }
            buildDays();
            triggerEvent("onMonthChange");
            updateNavigationCurrentMonth();
        }
        function clear(triggerChangeEvent, toInitial) {
            if (triggerChangeEvent === void 0) { triggerChangeEvent = true; }
            if (toInitial === void 0) { toInitial = true; }
            self.input.value = "";
            if (self.altInput !== undefined)
                self.altInput.value = "";
            if (self.mobileInput !== undefined)
                self.mobileInput.value = "";
            self.selectedDates = [];
            self.latestSelectedDateObj = undefined;
            if (toInitial === true) {
                self.currentYear = self._initialDate.getFullYear();
                self.currentMonth = self._initialDate.getMonth();
            }
            if (self.config.enableTime === true) {
                var _a = getDefaultHours(self.config), hours = _a.hours, minutes = _a.minutes, seconds = _a.seconds;
                setHours(hours, minutes, seconds);
            }
            self.redraw();
            if (triggerChangeEvent)
                triggerEvent("onChange");
        }
        function close() {
            self.isOpen = false;
            if (!self.isMobile) {
                if (self.calendarContainer !== undefined) {
                    self.calendarContainer.classList.remove("open");
                }
                if (self._input !== undefined) {
                    self._input.classList.remove("active");
                }
            }
            triggerEvent("onClose");
        }
        function destroy() {
            if (self.config !== undefined)
                triggerEvent("onDestroy");
            for (var i = self._handlers.length; i--;) {
                self._handlers[i].remove();
            }
            self._handlers = [];
            if (self.mobileInput) {
                if (self.mobileInput.parentNode)
                    self.mobileInput.parentNode.removeChild(self.mobileInput);
                self.mobileInput = undefined;
            }
            else if (self.calendarContainer && self.calendarContainer.parentNode) {
                if (self.config.static && self.calendarContainer.parentNode) {
                    var wrapper = self.calendarContainer.parentNode;
                    wrapper.lastChild && wrapper.removeChild(wrapper.lastChild);
                    if (wrapper.parentNode) {
                        while (wrapper.firstChild)
                            wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
                        wrapper.parentNode.removeChild(wrapper);
                    }
                }
                else
                    self.calendarContainer.parentNode.removeChild(self.calendarContainer);
            }
            if (self.altInput) {
                self.input.type = "text";
                if (self.altInput.parentNode)
                    self.altInput.parentNode.removeChild(self.altInput);
                delete self.altInput;
            }
            if (self.input) {
                self.input.type = self.input._type;
                self.input.classList.remove("flatpickr-input");
                self.input.removeAttribute("readonly");
            }
            [
                "_showTimeInput",
                "latestSelectedDateObj",
                "_hideNextMonthArrow",
                "_hidePrevMonthArrow",
                "__hideNextMonthArrow",
                "__hidePrevMonthArrow",
                "isMobile",
                "isOpen",
                "selectedDateElem",
                "minDateHasTime",
                "maxDateHasTime",
                "days",
                "daysContainer",
                "_input",
                "_positionElement",
                "innerContainer",
                "rContainer",
                "monthNav",
                "todayDateElem",
                "calendarContainer",
                "weekdayContainer",
                "prevMonthNav",
                "nextMonthNav",
                "monthsDropdownContainer",
                "currentMonthElement",
                "currentYearElement",
                "navigationCurrentMonth",
                "selectedDateElem",
                "config",
            ].forEach(function (k) {
                try {
                    delete self[k];
                }
                catch (_) { }
            });
        }
        function isCalendarElem(elem) {
            return self.calendarContainer.contains(elem);
        }
        function documentClick(e) {
            if (self.isOpen && !self.config.inline) {
                var eventTarget_1 = getEventTarget(e);
                var isCalendarElement = isCalendarElem(eventTarget_1);
                var isInput = eventTarget_1 === self.input ||
                    eventTarget_1 === self.altInput ||
                    self.element.contains(eventTarget_1) ||
                    (e.path &&
                        e.path.indexOf &&
                        (~e.path.indexOf(self.input) ||
                            ~e.path.indexOf(self.altInput)));
                var lostFocus = !isInput &&
                    !isCalendarElement &&
                    !isCalendarElem(e.relatedTarget);
                var isIgnored = !self.config.ignoredFocusElements.some(function (elem) {
                    return elem.contains(eventTarget_1);
                });
                if (lostFocus && isIgnored) {
                    if (self.config.allowInput) {
                        self.setDate(self._input.value, false, self.config.altInput
                            ? self.config.altFormat
                            : self.config.dateFormat);
                    }
                    if (self.timeContainer !== undefined &&
                        self.minuteElement !== undefined &&
                        self.hourElement !== undefined &&
                        self.input.value !== "" &&
                        self.input.value !== undefined) {
                        updateTime();
                    }
                    self.close();
                    if (self.config &&
                        self.config.mode === "range" &&
                        self.selectedDates.length === 1)
                        self.clear(false);
                }
            }
        }
        function changeYear(newYear) {
            if (!newYear ||
                (self.config.minDate && newYear < self.config.minDate.getFullYear()) ||
                (self.config.maxDate && newYear > self.config.maxDate.getFullYear()))
                return;
            var newYearNum = newYear, isNewYear = self.currentYear !== newYearNum;
            self.currentYear = newYearNum || self.currentYear;
            if (self.config.maxDate &&
                self.currentYear === self.config.maxDate.getFullYear()) {
                self.currentMonth = Math.min(self.config.maxDate.getMonth(), self.currentMonth);
            }
            else if (self.config.minDate &&
                self.currentYear === self.config.minDate.getFullYear()) {
                self.currentMonth = Math.max(self.config.minDate.getMonth(), self.currentMonth);
            }
            if (isNewYear) {
                self.redraw();
                triggerEvent("onYearChange");
                buildMonthSwitch();
            }
        }
        function isEnabled(date, timeless) {
            var _a;
            if (timeless === void 0) { timeless = true; }
            var dateToCheck = self.parseDate(date, undefined, timeless);
            if ((self.config.minDate &&
                dateToCheck &&
                compareDates(dateToCheck, self.config.minDate, timeless !== undefined ? timeless : !self.minDateHasTime) < 0) ||
                (self.config.maxDate &&
                    dateToCheck &&
                    compareDates(dateToCheck, self.config.maxDate, timeless !== undefined ? timeless : !self.maxDateHasTime) > 0))
                return false;
            if (!self.config.enable && self.config.disable.length === 0)
                return true;
            if (dateToCheck === undefined)
                return false;
            var bool = !!self.config.enable, array = (_a = self.config.enable) !== null && _a !== void 0 ? _a : self.config.disable;
            for (var i = 0, d = void 0; i < array.length; i++) {
                d = array[i];
                if (typeof d === "function" &&
                    d(dateToCheck))
                    return bool;
                else if (d instanceof Date &&
                    dateToCheck !== undefined &&
                    d.getTime() === dateToCheck.getTime())
                    return bool;
                else if (typeof d === "string") {
                    var parsed = self.parseDate(d, undefined, true);
                    return parsed && parsed.getTime() === dateToCheck.getTime()
                        ? bool
                        : !bool;
                }
                else if (typeof d === "object" &&
                    dateToCheck !== undefined &&
                    d.from &&
                    d.to &&
                    dateToCheck.getTime() >= d.from.getTime() &&
                    dateToCheck.getTime() <= d.to.getTime())
                    return bool;
            }
            return !bool;
        }
        function isInView(elem) {
            if (self.daysContainer !== undefined)
                return (elem.className.indexOf("hidden") === -1 &&
                    elem.className.indexOf("flatpickr-disabled") === -1 &&
                    self.daysContainer.contains(elem));
            return false;
        }
        function onBlur(e) {
            var isInput = e.target === self._input;
            if (isInput &&
                (self.selectedDates.length > 0 || self._input.value.length > 0) &&
                !(e.relatedTarget && isCalendarElem(e.relatedTarget))) {
                self.setDate(self._input.value, true, e.target === self.altInput
                    ? self.config.altFormat
                    : self.config.dateFormat);
            }
        }
        function onKeyDown(e) {
            var eventTarget = getEventTarget(e);
            var isInput = self.config.wrap
                ? element.contains(eventTarget)
                : eventTarget === self._input;
            var allowInput = self.config.allowInput;
            var allowKeydown = self.isOpen && (!allowInput || !isInput);
            var allowInlineKeydown = self.config.inline && isInput && !allowInput;
            if (e.keyCode === 13 && isInput) {
                if (allowInput) {
                    self.setDate(self._input.value, true, eventTarget === self.altInput
                        ? self.config.altFormat
                        : self.config.dateFormat);
                    self.close();
                    return eventTarget.blur();
                }
                else {
                    self.open();
                }
            }
            else if (isCalendarElem(eventTarget) ||
                allowKeydown ||
                allowInlineKeydown) {
                var isTimeObj = !!self.timeContainer &&
                    self.timeContainer.contains(eventTarget);
                switch (e.keyCode) {
                    case 13:
                        if (isTimeObj) {
                            e.preventDefault();
                            updateTime();
                            focusAndClose();
                        }
                        else
                            selectDate(e);
                        break;
                    case 27:
                        e.preventDefault();
                        focusAndClose();
                        break;
                    case 8:
                    case 46:
                        if (isInput && !self.config.allowInput) {
                            e.preventDefault();
                            self.clear();
                        }
                        break;
                    case 37:
                    case 39:
                        if (!isTimeObj && !isInput) {
                            e.preventDefault();
                            var activeElement = getClosestActiveElement();
                            if (self.daysContainer !== undefined &&
                                (allowInput === false ||
                                    (activeElement && isInView(activeElement)))) {
                                var delta_1 = e.keyCode === 39 ? 1 : -1;
                                if (!e.ctrlKey)
                                    focusOnDay(undefined, delta_1);
                                else {
                                    e.stopPropagation();
                                    changeMonth(delta_1);
                                    focusOnDay(getFirstAvailableDay(1), 0);
                                }
                            }
                        }
                        else if (self.hourElement)
                            self.hourElement.focus();
                        break;
                    case 38:
                    case 40:
                        e.preventDefault();
                        var delta = e.keyCode === 40 ? 1 : -1;
                        if ((self.daysContainer &&
                            eventTarget.$i !== undefined) ||
                            eventTarget === self.input ||
                            eventTarget === self.altInput) {
                            if (e.ctrlKey) {
                                e.stopPropagation();
                                changeYear(self.currentYear - delta);
                                focusOnDay(getFirstAvailableDay(1), 0);
                            }
                            else if (!isTimeObj)
                                focusOnDay(undefined, delta * 7);
                        }
                        else if (eventTarget === self.currentYearElement) {
                            changeYear(self.currentYear - delta);
                        }
                        else if (self.config.enableTime) {
                            if (!isTimeObj && self.hourElement)
                                self.hourElement.focus();
                            updateTime(e);
                            self._debouncedChange();
                        }
                        break;
                    case 9:
                        if (isTimeObj) {
                            var elems = [
                                self.hourElement,
                                self.minuteElement,
                                self.secondElement,
                                self.amPM,
                            ]
                                .concat(self.pluginElements)
                                .filter(function (x) { return x; });
                            var i = elems.indexOf(eventTarget);
                            if (i !== -1) {
                                var target = elems[i + (e.shiftKey ? -1 : 1)];
                                e.preventDefault();
                                (target || self._input).focus();
                            }
                        }
                        else if (!self.config.noCalendar &&
                            self.daysContainer &&
                            self.daysContainer.contains(eventTarget) &&
                            e.shiftKey) {
                            e.preventDefault();
                            self._input.focus();
                        }
                        break;
                }
            }
            if (self.amPM !== undefined && eventTarget === self.amPM) {
                switch (e.key) {
                    case self.l10n.amPM[0].charAt(0):
                    case self.l10n.amPM[0].charAt(0).toLowerCase():
                        self.amPM.textContent = self.l10n.amPM[0];
                        setHoursFromInputs();
                        updateValue();
                        break;
                    case self.l10n.amPM[1].charAt(0):
                    case self.l10n.amPM[1].charAt(0).toLowerCase():
                        self.amPM.textContent = self.l10n.amPM[1];
                        setHoursFromInputs();
                        updateValue();
                        break;
                }
            }
            if (isInput || isCalendarElem(eventTarget)) {
                triggerEvent("onKeyDown", e);
            }
        }
        function onMouseOver(elem, cellClass) {
            if (cellClass === void 0) { cellClass = "flatpickr-day"; }
            if (self.selectedDates.length !== 1 ||
                (elem &&
                    (!elem.classList.contains(cellClass) ||
                        elem.classList.contains("flatpickr-disabled"))))
                return;
            var hoverDate = elem
                ? elem.dateObj.getTime()
                : self.days.firstElementChild.dateObj.getTime(), initialDate = self.parseDate(self.selectedDates[0], undefined, true).getTime(), rangeStartDate = Math.min(hoverDate, self.selectedDates[0].getTime()), rangeEndDate = Math.max(hoverDate, self.selectedDates[0].getTime());
            var containsDisabled = false;
            var minRange = 0, maxRange = 0;
            for (var t = rangeStartDate; t < rangeEndDate; t += duration.DAY) {
                if (!isEnabled(new Date(t), true)) {
                    containsDisabled =
                        containsDisabled || (t > rangeStartDate && t < rangeEndDate);
                    if (t < initialDate && (!minRange || t > minRange))
                        minRange = t;
                    else if (t > initialDate && (!maxRange || t < maxRange))
                        maxRange = t;
                }
            }
            var hoverableCells = Array.from(self.rContainer.querySelectorAll("*:nth-child(-n+" + self.config.showMonths + ") > ." + cellClass));
            hoverableCells.forEach(function (dayElem) {
                var date = dayElem.dateObj;
                var timestamp = date.getTime();
                var outOfRange = (minRange > 0 && timestamp < minRange) ||
                    (maxRange > 0 && timestamp > maxRange);
                if (outOfRange) {
                    dayElem.classList.add("notAllowed");
                    ["inRange", "startRange", "endRange"].forEach(function (c) {
                        dayElem.classList.remove(c);
                    });
                    return;
                }
                else if (containsDisabled && !outOfRange)
                    return;
                ["startRange", "inRange", "endRange", "notAllowed"].forEach(function (c) {
                    dayElem.classList.remove(c);
                });
                if (elem !== undefined) {
                    elem.classList.add(hoverDate <= self.selectedDates[0].getTime()
                        ? "startRange"
                        : "endRange");
                    if (initialDate < hoverDate && timestamp === initialDate)
                        dayElem.classList.add("startRange");
                    else if (initialDate > hoverDate && timestamp === initialDate)
                        dayElem.classList.add("endRange");
                    if (timestamp >= minRange &&
                        (maxRange === 0 || timestamp <= maxRange) &&
                        isBetween(timestamp, initialDate, hoverDate))
                        dayElem.classList.add("inRange");
                }
            });
        }
        function onResize() {
            if (self.isOpen && !self.config.static && !self.config.inline)
                positionCalendar();
        }
        function open(e, positionElement) {
            if (positionElement === void 0) { positionElement = self._positionElement; }
            if (self.isMobile === true) {
                if (e) {
                    e.preventDefault();
                    var eventTarget = getEventTarget(e);
                    if (eventTarget) {
                        eventTarget.blur();
                    }
                }
                if (self.mobileInput !== undefined) {
                    self.mobileInput.focus();
                    self.mobileInput.click();
                }
                triggerEvent("onOpen");
                return;
            }
            else if (self._input.disabled || self.config.inline) {
                return;
            }
            var wasOpen = self.isOpen;
            self.isOpen = true;
            if (!wasOpen) {
                self.calendarContainer.classList.add("open");
                self._input.classList.add("active");
                triggerEvent("onOpen");
                positionCalendar(positionElement);
            }
            if (self.config.enableTime === true && self.config.noCalendar === true) {
                if (self.config.allowInput === false &&
                    (e === undefined ||
                        !self.timeContainer.contains(e.relatedTarget))) {
                    setTimeout(function () { return self.hourElement.select(); }, 50);
                }
            }
        }
        function minMaxDateSetter(type) {
            return function (date) {
                var dateObj = (self.config["_" + type + "Date"] = self.parseDate(date, self.config.dateFormat));
                var inverseDateObj = self.config["_" + (type === "min" ? "max" : "min") + "Date"];
                if (dateObj !== undefined) {
                    self[type === "min" ? "minDateHasTime" : "maxDateHasTime"] =
                        dateObj.getHours() > 0 ||
                            dateObj.getMinutes() > 0 ||
                            dateObj.getSeconds() > 0;
                }
                if (self.selectedDates) {
                    self.selectedDates = self.selectedDates.filter(function (d) { return isEnabled(d); });
                    if (!self.selectedDates.length && type === "min")
                        setHoursFromDate(dateObj);
                    updateValue();
                }
                if (self.daysContainer) {
                    redraw();
                    if (dateObj !== undefined)
                        self.currentYearElement[type] = dateObj.getFullYear().toString();
                    else
                        self.currentYearElement.removeAttribute(type);
                    self.currentYearElement.disabled =
                        !!inverseDateObj &&
                            dateObj !== undefined &&
                            inverseDateObj.getFullYear() === dateObj.getFullYear();
                }
            };
        }
        function parseConfig() {
            var boolOpts = [
                "wrap",
                "weekNumbers",
                "allowInput",
                "allowInvalidPreload",
                "clickOpens",
                "time_24hr",
                "enableTime",
                "noCalendar",
                "altInput",
                "shorthandCurrentMonth",
                "inline",
                "static",
                "enableSeconds",
                "disableMobile",
            ];
            var userConfig = __assign(__assign({}, JSON.parse(JSON.stringify(element.dataset || {}))), instanceConfig);
            var formats = {};
            self.config.parseDate = userConfig.parseDate;
            self.config.formatDate = userConfig.formatDate;
            Object.defineProperty(self.config, "enable", {
                get: function () { return self.config._enable; },
                set: function (dates) {
                    self.config._enable = parseDateRules(dates);
                },
            });
            Object.defineProperty(self.config, "disable", {
                get: function () { return self.config._disable; },
                set: function (dates) {
                    self.config._disable = parseDateRules(dates);
                },
            });
            var timeMode = userConfig.mode === "time";
            if (!userConfig.dateFormat && (userConfig.enableTime || timeMode)) {
                var defaultDateFormat = flatpickr.defaultConfig.dateFormat || defaults.dateFormat;
                formats.dateFormat =
                    userConfig.noCalendar || timeMode
                        ? "H:i" + (userConfig.enableSeconds ? ":S" : "")
                        : defaultDateFormat + " H:i" + (userConfig.enableSeconds ? ":S" : "");
            }
            if (userConfig.altInput &&
                (userConfig.enableTime || timeMode) &&
                !userConfig.altFormat) {
                var defaultAltFormat = flatpickr.defaultConfig.altFormat || defaults.altFormat;
                formats.altFormat =
                    userConfig.noCalendar || timeMode
                        ? "h:i" + (userConfig.enableSeconds ? ":S K" : " K")
                        : defaultAltFormat + (" h:i" + (userConfig.enableSeconds ? ":S" : "") + " K");
            }
            Object.defineProperty(self.config, "minDate", {
                get: function () { return self.config._minDate; },
                set: minMaxDateSetter("min"),
            });
            Object.defineProperty(self.config, "maxDate", {
                get: function () { return self.config._maxDate; },
                set: minMaxDateSetter("max"),
            });
            var minMaxTimeSetter = function (type) { return function (val) {
                self.config[type === "min" ? "_minTime" : "_maxTime"] = self.parseDate(val, "H:i:S");
            }; };
            Object.defineProperty(self.config, "minTime", {
                get: function () { return self.config._minTime; },
                set: minMaxTimeSetter("min"),
            });
            Object.defineProperty(self.config, "maxTime", {
                get: function () { return self.config._maxTime; },
                set: minMaxTimeSetter("max"),
            });
            if (userConfig.mode === "time") {
                self.config.noCalendar = true;
                self.config.enableTime = true;
            }
            Object.assign(self.config, formats, userConfig);
            for (var i = 0; i < boolOpts.length; i++)
                self.config[boolOpts[i]] =
                    self.config[boolOpts[i]] === true ||
                        self.config[boolOpts[i]] === "true";
            HOOKS.filter(function (hook) { return self.config[hook] !== undefined; }).forEach(function (hook) {
                self.config[hook] = arrayify(self.config[hook] || []).map(bindToInstance);
            });
            self.isMobile =
                !self.config.disableMobile &&
                    !self.config.inline &&
                    self.config.mode === "single" &&
                    !self.config.disable.length &&
                    !self.config.enable &&
                    !self.config.weekNumbers &&
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            for (var i = 0; i < self.config.plugins.length; i++) {
                var pluginConf = self.config.plugins[i](self) || {};
                for (var key in pluginConf) {
                    if (HOOKS.indexOf(key) > -1) {
                        self.config[key] = arrayify(pluginConf[key])
                            .map(bindToInstance)
                            .concat(self.config[key]);
                    }
                    else if (typeof userConfig[key] === "undefined")
                        self.config[key] = pluginConf[key];
                }
            }
            if (!userConfig.altInputClass) {
                self.config.altInputClass =
                    getInputElem().className + " " + self.config.altInputClass;
            }
            triggerEvent("onParseConfig");
        }
        function getInputElem() {
            return self.config.wrap
                ? element.querySelector("[data-input]")
                : element;
        }
        function setupLocale() {
            if (typeof self.config.locale !== "object" &&
                typeof flatpickr.l10ns[self.config.locale] === "undefined")
                self.config.errorHandler(new Error("flatpickr: invalid locale " + self.config.locale));
            self.l10n = __assign(__assign({}, flatpickr.l10ns.default), (typeof self.config.locale === "object"
                ? self.config.locale
                : self.config.locale !== "default"
                    ? flatpickr.l10ns[self.config.locale]
                    : undefined));
            tokenRegex.D = "(" + self.l10n.weekdays.shorthand.join("|") + ")";
            tokenRegex.l = "(" + self.l10n.weekdays.longhand.join("|") + ")";
            tokenRegex.M = "(" + self.l10n.months.shorthand.join("|") + ")";
            tokenRegex.F = "(" + self.l10n.months.longhand.join("|") + ")";
            tokenRegex.K = "(" + self.l10n.amPM[0] + "|" + self.l10n.amPM[1] + "|" + self.l10n.amPM[0].toLowerCase() + "|" + self.l10n.amPM[1].toLowerCase() + ")";
            var userConfig = __assign(__assign({}, instanceConfig), JSON.parse(JSON.stringify(element.dataset || {})));
            if (userConfig.time_24hr === undefined &&
                flatpickr.defaultConfig.time_24hr === undefined) {
                self.config.time_24hr = self.l10n.time_24hr;
            }
            self.formatDate = createDateFormatter(self);
            self.parseDate = createDateParser({ config: self.config, l10n: self.l10n });
        }
        function positionCalendar(customPositionElement) {
            if (typeof self.config.position === "function") {
                return void self.config.position(self, customPositionElement);
            }
            if (self.calendarContainer === undefined)
                return;
            triggerEvent("onPreCalendarPosition");
            var positionElement = customPositionElement || self._positionElement;
            var calendarHeight = Array.prototype.reduce.call(self.calendarContainer.children, (function (acc, child) { return acc + child.offsetHeight; }), 0), calendarWidth = self.calendarContainer.offsetWidth, configPos = self.config.position.split(" "), configPosVertical = configPos[0], configPosHorizontal = configPos.length > 1 ? configPos[1] : null, inputBounds = positionElement.getBoundingClientRect(), distanceFromBottom = window.innerHeight - inputBounds.bottom, showOnTop = configPosVertical === "above" ||
                (configPosVertical !== "below" &&
                    distanceFromBottom < calendarHeight &&
                    inputBounds.top > calendarHeight);
            var top = window.pageYOffset +
                inputBounds.top +
                (!showOnTop ? positionElement.offsetHeight + 2 : -calendarHeight - 2);
            toggleClass(self.calendarContainer, "arrowTop", !showOnTop);
            toggleClass(self.calendarContainer, "arrowBottom", showOnTop);
            if (self.config.inline)
                return;
            var left = window.pageXOffset + inputBounds.left;
            var isCenter = false;
            var isRight = false;
            if (configPosHorizontal === "center") {
                left -= (calendarWidth - inputBounds.width) / 2;
                isCenter = true;
            }
            else if (configPosHorizontal === "right") {
                left -= calendarWidth - inputBounds.width;
                isRight = true;
            }
            toggleClass(self.calendarContainer, "arrowLeft", !isCenter && !isRight);
            toggleClass(self.calendarContainer, "arrowCenter", isCenter);
            toggleClass(self.calendarContainer, "arrowRight", isRight);
            var right = window.document.body.offsetWidth -
                (window.pageXOffset + inputBounds.right);
            var rightMost = left + calendarWidth > window.document.body.offsetWidth;
            var centerMost = right + calendarWidth > window.document.body.offsetWidth;
            toggleClass(self.calendarContainer, "rightMost", rightMost);
            if (self.config.static)
                return;
            self.calendarContainer.style.top = top + "px";
            if (!rightMost) {
                self.calendarContainer.style.left = left + "px";
                self.calendarContainer.style.right = "auto";
            }
            else if (!centerMost) {
                self.calendarContainer.style.left = "auto";
                self.calendarContainer.style.right = right + "px";
            }
            else {
                var doc = getDocumentStyleSheet();
                if (doc === undefined)
                    return;
                var bodyWidth = window.document.body.offsetWidth;
                var centerLeft = Math.max(0, bodyWidth / 2 - calendarWidth / 2);
                var centerBefore = ".flatpickr-calendar.centerMost:before";
                var centerAfter = ".flatpickr-calendar.centerMost:after";
                var centerIndex = doc.cssRules.length;
                var centerStyle = "{left:" + inputBounds.left + "px;right:auto;}";
                toggleClass(self.calendarContainer, "rightMost", false);
                toggleClass(self.calendarContainer, "centerMost", true);
                doc.insertRule(centerBefore + "," + centerAfter + centerStyle, centerIndex);
                self.calendarContainer.style.left = centerLeft + "px";
                self.calendarContainer.style.right = "auto";
            }
        }
        function getDocumentStyleSheet() {
            var editableSheet = null;
            for (var i = 0; i < document.styleSheets.length; i++) {
                var sheet = document.styleSheets[i];
                if (!sheet.cssRules)
                    continue;
                try {
                    sheet.cssRules;
                }
                catch (err) {
                    continue;
                }
                editableSheet = sheet;
                break;
            }
            return editableSheet != null ? editableSheet : createStyleSheet();
        }
        function createStyleSheet() {
            var style = document.createElement("style");
            document.head.appendChild(style);
            return style.sheet;
        }
        function redraw() {
            if (self.config.noCalendar || self.isMobile)
                return;
            buildMonthSwitch();
            updateNavigationCurrentMonth();
            buildDays();
        }
        function focusAndClose() {
            self._input.focus();
            if (window.navigator.userAgent.indexOf("MSIE") !== -1 ||
                navigator.msMaxTouchPoints !== undefined) {
                setTimeout(self.close, 0);
            }
            else {
                self.close();
            }
        }
        function selectDate(e) {
            e.preventDefault();
            e.stopPropagation();
            var isSelectable = function (day) {
                return day.classList &&
                    day.classList.contains("flatpickr-day") &&
                    !day.classList.contains("flatpickr-disabled") &&
                    !day.classList.contains("notAllowed");
            };
            var t = findParent(getEventTarget(e), isSelectable);
            if (t === undefined)
                return;
            var target = t;
            var selectedDate = (self.latestSelectedDateObj = new Date(target.dateObj.getTime()));
            var shouldChangeMonth = (selectedDate.getMonth() < self.currentMonth ||
                selectedDate.getMonth() >
                    self.currentMonth + self.config.showMonths - 1) &&
                self.config.mode !== "range";
            self.selectedDateElem = target;
            if (self.config.mode === "single")
                self.selectedDates = [selectedDate];
            else if (self.config.mode === "multiple") {
                var selectedIndex = isDateSelected(selectedDate);
                if (selectedIndex)
                    self.selectedDates.splice(parseInt(selectedIndex), 1);
                else
                    self.selectedDates.push(selectedDate);
            }
            else if (self.config.mode === "range") {
                if (self.selectedDates.length === 2) {
                    self.clear(false, false);
                }
                self.latestSelectedDateObj = selectedDate;
                self.selectedDates.push(selectedDate);
                if (compareDates(selectedDate, self.selectedDates[0], true) !== 0)
                    self.selectedDates.sort(function (a, b) { return a.getTime() - b.getTime(); });
            }
            setHoursFromInputs();
            if (shouldChangeMonth) {
                var isNewYear = self.currentYear !== selectedDate.getFullYear();
                self.currentYear = selectedDate.getFullYear();
                self.currentMonth = selectedDate.getMonth();
                if (isNewYear) {
                    triggerEvent("onYearChange");
                    buildMonthSwitch();
                }
                triggerEvent("onMonthChange");
            }
            updateNavigationCurrentMonth();
            buildDays();
            updateValue();
            if (!shouldChangeMonth &&
                self.config.mode !== "range" &&
                self.config.showMonths === 1)
                focusOnDayElem(target);
            else if (self.selectedDateElem !== undefined &&
                self.hourElement === undefined) {
                self.selectedDateElem && self.selectedDateElem.focus();
            }
            if (self.hourElement !== undefined)
                self.hourElement !== undefined && self.hourElement.focus();
            if (self.config.closeOnSelect) {
                var single = self.config.mode === "single" && !self.config.enableTime;
                var range = self.config.mode === "range" &&
                    self.selectedDates.length === 2 &&
                    !self.config.enableTime;
                if (single || range) {
                    focusAndClose();
                }
            }
            triggerChange();
        }
        var CALLBACKS = {
            locale: [setupLocale, updateWeekdays],
            showMonths: [buildMonths, setCalendarWidth, buildWeekdays],
            minDate: [jumpToDate],
            maxDate: [jumpToDate],
            positionElement: [updatePositionElement],
            clickOpens: [
                function () {
                    if (self.config.clickOpens === true) {
                        bind(self._input, "focus", self.open);
                        bind(self._input, "click", self.open);
                    }
                    else {
                        self._input.removeEventListener("focus", self.open);
                        self._input.removeEventListener("click", self.open);
                    }
                },
            ],
        };
        function set(option, value) {
            if (option !== null && typeof option === "object") {
                Object.assign(self.config, option);
                for (var key in option) {
                    if (CALLBACKS[key] !== undefined)
                        CALLBACKS[key].forEach(function (x) { return x(); });
                }
            }
            else {
                self.config[option] = value;
                if (CALLBACKS[option] !== undefined)
                    CALLBACKS[option].forEach(function (x) { return x(); });
                else if (HOOKS.indexOf(option) > -1)
                    self.config[option] = arrayify(value);
            }
            self.redraw();
            updateValue(true);
        }
        function setSelectedDate(inputDate, format) {
            var dates = [];
            if (inputDate instanceof Array)
                dates = inputDate.map(function (d) { return self.parseDate(d, format); });
            else if (inputDate instanceof Date || typeof inputDate === "number")
                dates = [self.parseDate(inputDate, format)];
            else if (typeof inputDate === "string") {
                switch (self.config.mode) {
                    case "single":
                    case "time":
                        dates = [self.parseDate(inputDate, format)];
                        break;
                    case "multiple":
                        dates = inputDate
                            .split(self.config.conjunction)
                            .map(function (date) { return self.parseDate(date, format); });
                        break;
                    case "range":
                        dates = inputDate
                            .split(self.l10n.rangeSeparator)
                            .map(function (date) { return self.parseDate(date, format); });
                        break;
                }
            }
            else
                self.config.errorHandler(new Error("Invalid date supplied: " + JSON.stringify(inputDate)));
            self.selectedDates = (self.config.allowInvalidPreload
                ? dates
                : dates.filter(function (d) { return d instanceof Date && isEnabled(d, false); }));
            if (self.config.mode === "range")
                self.selectedDates.sort(function (a, b) { return a.getTime() - b.getTime(); });
        }
        function setDate(date, triggerChange, format) {
            if (triggerChange === void 0) { triggerChange = false; }
            if (format === void 0) { format = self.config.dateFormat; }
            if ((date !== 0 && !date) || (date instanceof Array && date.length === 0))
                return self.clear(triggerChange);
            setSelectedDate(date, format);
            self.latestSelectedDateObj =
                self.selectedDates[self.selectedDates.length - 1];
            self.redraw();
            jumpToDate(undefined, triggerChange);
            setHoursFromDate();
            if (self.selectedDates.length === 0) {
                self.clear(false);
            }
            updateValue(triggerChange);
            if (triggerChange)
                triggerEvent("onChange");
        }
        function parseDateRules(arr) {
            return arr
                .slice()
                .map(function (rule) {
                if (typeof rule === "string" ||
                    typeof rule === "number" ||
                    rule instanceof Date) {
                    return self.parseDate(rule, undefined, true);
                }
                else if (rule &&
                    typeof rule === "object" &&
                    rule.from &&
                    rule.to)
                    return {
                        from: self.parseDate(rule.from, undefined),
                        to: self.parseDate(rule.to, undefined),
                    };
                return rule;
            })
                .filter(function (x) { return x; });
        }
        function setupDates() {
            self.selectedDates = [];
            self.now = self.parseDate(self.config.now) || new Date();
            var preloadedDate = self.config.defaultDate ||
                ((self.input.nodeName === "INPUT" ||
                    self.input.nodeName === "TEXTAREA") &&
                    self.input.placeholder &&
                    self.input.value === self.input.placeholder
                    ? null
                    : self.input.value);
            if (preloadedDate)
                setSelectedDate(preloadedDate, self.config.dateFormat);
            self._initialDate =
                self.selectedDates.length > 0
                    ? self.selectedDates[0]
                    : self.config.minDate &&
                        self.config.minDate.getTime() > self.now.getTime()
                        ? self.config.minDate
                        : self.config.maxDate &&
                            self.config.maxDate.getTime() < self.now.getTime()
                            ? self.config.maxDate
                            : self.now;
            self.currentYear = self._initialDate.getFullYear();
            self.currentMonth = self._initialDate.getMonth();
            if (self.selectedDates.length > 0)
                self.latestSelectedDateObj = self.selectedDates[0];
            if (self.config.minTime !== undefined)
                self.config.minTime = self.parseDate(self.config.minTime, "H:i");
            if (self.config.maxTime !== undefined)
                self.config.maxTime = self.parseDate(self.config.maxTime, "H:i");
            self.minDateHasTime =
                !!self.config.minDate &&
                    (self.config.minDate.getHours() > 0 ||
                        self.config.minDate.getMinutes() > 0 ||
                        self.config.minDate.getSeconds() > 0);
            self.maxDateHasTime =
                !!self.config.maxDate &&
                    (self.config.maxDate.getHours() > 0 ||
                        self.config.maxDate.getMinutes() > 0 ||
                        self.config.maxDate.getSeconds() > 0);
        }
        function setupInputs() {
            self.input = getInputElem();
            if (!self.input) {
                self.config.errorHandler(new Error("Invalid input element specified"));
                return;
            }
            self.input._type = self.input.type;
            self.input.type = "text";
            self.input.classList.add("flatpickr-input");
            self._input = self.input;
            if (self.config.altInput) {
                self.altInput = createElement(self.input.nodeName, self.config.altInputClass);
                self._input = self.altInput;
                self.altInput.placeholder = self.input.placeholder;
                self.altInput.disabled = self.input.disabled;
                self.altInput.required = self.input.required;
                self.altInput.tabIndex = self.input.tabIndex;
                self.altInput.type = "text";
                self.input.setAttribute("type", "hidden");
                if (!self.config.static && self.input.parentNode)
                    self.input.parentNode.insertBefore(self.altInput, self.input.nextSibling);
            }
            if (!self.config.allowInput)
                self._input.setAttribute("readonly", "readonly");
            updatePositionElement();
        }
        function updatePositionElement() {
            self._positionElement = self.config.positionElement || self._input;
        }
        function setupMobile() {
            var inputType = self.config.enableTime
                ? self.config.noCalendar
                    ? "time"
                    : "datetime-local"
                : "date";
            self.mobileInput = createElement("input", self.input.className + " flatpickr-mobile");
            self.mobileInput.tabIndex = 1;
            self.mobileInput.type = inputType;
            self.mobileInput.disabled = self.input.disabled;
            self.mobileInput.required = self.input.required;
            self.mobileInput.placeholder = self.input.placeholder;
            self.mobileFormatStr =
                inputType === "datetime-local"
                    ? "Y-m-d\\TH:i:S"
                    : inputType === "date"
                        ? "Y-m-d"
                        : "H:i:S";
            if (self.selectedDates.length > 0) {
                self.mobileInput.defaultValue = self.mobileInput.value = self.formatDate(self.selectedDates[0], self.mobileFormatStr);
            }
            if (self.config.minDate)
                self.mobileInput.min = self.formatDate(self.config.minDate, "Y-m-d");
            if (self.config.maxDate)
                self.mobileInput.max = self.formatDate(self.config.maxDate, "Y-m-d");
            if (self.input.getAttribute("step"))
                self.mobileInput.step = String(self.input.getAttribute("step"));
            self.input.type = "hidden";
            if (self.altInput !== undefined)
                self.altInput.type = "hidden";
            try {
                if (self.input.parentNode)
                    self.input.parentNode.insertBefore(self.mobileInput, self.input.nextSibling);
            }
            catch (_a) { }
            bind(self.mobileInput, "change", function (e) {
                self.setDate(getEventTarget(e).value, false, self.mobileFormatStr);
                triggerEvent("onChange");
                triggerEvent("onClose");
            });
        }
        function toggle(e) {
            if (self.isOpen === true)
                return self.close();
            self.open(e);
        }
        function triggerEvent(event, data) {
            if (self.config === undefined)
                return;
            var hooks = self.config[event];
            if (hooks !== undefined && hooks.length > 0) {
                for (var i = 0; hooks[i] && i < hooks.length; i++)
                    hooks[i](self.selectedDates, self.input.value, self, data);
            }
            if (event === "onChange") {
                self.input.dispatchEvent(createEvent("change"));
                self.input.dispatchEvent(createEvent("input"));
            }
        }
        function createEvent(name) {
            var e = document.createEvent("Event");
            e.initEvent(name, true, true);
            return e;
        }
        function isDateSelected(date) {
            for (var i = 0; i < self.selectedDates.length; i++) {
                var selectedDate = self.selectedDates[i];
                if (selectedDate instanceof Date && compareDates(selectedDate, date) === 0)
                    return "" + i;
            }
            return false;
        }
        function isDateInRange(date) {
            if (self.config.mode !== "range" || self.selectedDates.length < 2)
                return false;
            return (compareDates(date, self.selectedDates[0]) >= 0 &&
                compareDates(date, self.selectedDates[1]) <= 0);
        }
        function updateNavigationCurrentMonth() {
            if (self.config.noCalendar || self.isMobile || !self.monthNav)
                return;
            self.yearElements.forEach(function (yearElement, i) {
                var d = new Date(self.currentYear, self.currentMonth, 1);
                d.setMonth(self.currentMonth + i);
                if (self.config.showMonths > 1 ||
                    self.config.monthSelectorType === "static") {
                    self.monthElements[i].textContent =
                        monthToStr(d.getMonth(), self.config.shorthandCurrentMonth, self.l10n) + " ";
                }
                else {
                    self.monthsDropdownContainer.value = d.getMonth().toString();
                }
                yearElement.value = d.getFullYear().toString();
            });
            self._hidePrevMonthArrow =
                self.config.minDate !== undefined &&
                    (self.currentYear === self.config.minDate.getFullYear()
                        ? self.currentMonth <= self.config.minDate.getMonth()
                        : self.currentYear < self.config.minDate.getFullYear());
            self._hideNextMonthArrow =
                self.config.maxDate !== undefined &&
                    (self.currentYear === self.config.maxDate.getFullYear()
                        ? self.currentMonth + 1 > self.config.maxDate.getMonth()
                        : self.currentYear > self.config.maxDate.getFullYear());
        }
        function getDateStr(format) {
            return self.selectedDates
                .map(function (dObj) { return self.formatDate(dObj, format); })
                .filter(function (d, i, arr) {
                return self.config.mode !== "range" ||
                    self.config.enableTime ||
                    arr.indexOf(d) === i;
            })
                .join(self.config.mode !== "range"
                ? self.config.conjunction
                : self.l10n.rangeSeparator);
        }
        function updateValue(triggerChange) {
            if (triggerChange === void 0) { triggerChange = true; }
            if (self.mobileInput !== undefined && self.mobileFormatStr) {
                self.mobileInput.value =
                    self.latestSelectedDateObj !== undefined
                        ? self.formatDate(self.latestSelectedDateObj, self.mobileFormatStr)
                        : "";
            }
            self.input.value = getDateStr(self.config.dateFormat);
            if (self.altInput !== undefined) {
                self.altInput.value = getDateStr(self.config.altFormat);
            }
            if (triggerChange !== false)
                triggerEvent("onValueUpdate");
        }
        function onMonthNavClick(e) {
            var eventTarget = getEventTarget(e);
            var isPrevMonth = self.prevMonthNav.contains(eventTarget);
            var isNextMonth = self.nextMonthNav.contains(eventTarget);
            if (isPrevMonth || isNextMonth) {
                changeMonth(isPrevMonth ? -1 : 1);
            }
            else if (self.yearElements.indexOf(eventTarget) >= 0) {
                eventTarget.select();
            }
            else if (eventTarget.classList.contains("arrowUp")) {
                self.changeYear(self.currentYear + 1);
            }
            else if (eventTarget.classList.contains("arrowDown")) {
                self.changeYear(self.currentYear - 1);
            }
        }
        function timeWrapper(e) {
            e.preventDefault();
            var isKeyDown = e.type === "keydown", eventTarget = getEventTarget(e), input = eventTarget;
            if (self.amPM !== undefined && eventTarget === self.amPM) {
                self.amPM.textContent =
                    self.l10n.amPM[int(self.amPM.textContent === self.l10n.amPM[0])];
            }
            var min = parseFloat(input.getAttribute("min")), max = parseFloat(input.getAttribute("max")), step = parseFloat(input.getAttribute("step")), curValue = parseInt(input.value, 10), delta = e.delta ||
                (isKeyDown ? (e.which === 38 ? 1 : -1) : 0);
            var newValue = curValue + step * delta;
            if (typeof input.value !== "undefined" && input.value.length === 2) {
                var isHourElem = input === self.hourElement, isMinuteElem = input === self.minuteElement;
                if (newValue < min) {
                    newValue =
                        max +
                            newValue +
                            int(!isHourElem) +
                            (int(isHourElem) && int(!self.amPM));
                    if (isMinuteElem)
                        incrementNumInput(undefined, -1, self.hourElement);
                }
                else if (newValue > max) {
                    newValue =
                        input === self.hourElement ? newValue - max - int(!self.amPM) : min;
                    if (isMinuteElem)
                        incrementNumInput(undefined, 1, self.hourElement);
                }
                if (self.amPM &&
                    isHourElem &&
                    (step === 1
                        ? newValue + curValue === 23
                        : Math.abs(newValue - curValue) > step)) {
                    self.amPM.textContent =
                        self.l10n.amPM[int(self.amPM.textContent === self.l10n.amPM[0])];
                }
                input.value = pad(newValue);
            }
        }
        init();
        return self;
    }
    function _flatpickr(nodeList, config) {
        var nodes = Array.prototype.slice
            .call(nodeList)
            .filter(function (x) { return x instanceof HTMLElement; });
        var instances = [];
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            try {
                if (node.getAttribute("data-fp-omit") !== null)
                    continue;
                if (node._flatpickr !== undefined) {
                    node._flatpickr.destroy();
                    node._flatpickr = undefined;
                }
                node._flatpickr = FlatpickrInstance(node, config || {});
                instances.push(node._flatpickr);
            }
            catch (e) {
                console.error(e);
            }
        }
        return instances.length === 1 ? instances[0] : instances;
    }
    if (typeof HTMLElement !== "undefined" &&
        typeof HTMLCollection !== "undefined" &&
        typeof NodeList !== "undefined") {
        HTMLCollection.prototype.flatpickr = NodeList.prototype.flatpickr = function (config) {
            return _flatpickr(this, config);
        };
        HTMLElement.prototype.flatpickr = function (config) {
            return _flatpickr([this], config);
        };
    }
    var flatpickr = function (selector, config) {
        if (typeof selector === "string") {
            return _flatpickr(window.document.querySelectorAll(selector), config);
        }
        else if (selector instanceof Node) {
            return _flatpickr([selector], config);
        }
        else {
            return _flatpickr(selector, config);
        }
    };
    flatpickr.defaultConfig = {};
    flatpickr.l10ns = {
        en: __assign({}, english),
        default: __assign({}, english),
    };
    flatpickr.localize = function (l10n) {
        flatpickr.l10ns.default = __assign(__assign({}, flatpickr.l10ns.default), l10n);
    };
    flatpickr.setDefaults = function (config) {
        flatpickr.defaultConfig = __assign(__assign({}, flatpickr.defaultConfig), config);
    };
    flatpickr.parseDate = createDateParser({});
    flatpickr.formatDate = createDateFormatter({});
    flatpickr.compareDates = compareDates;
    if (typeof jQuery !== "undefined" && typeof jQuery.fn !== "undefined") {
        jQuery.fn.flatpickr = function (config) {
            return _flatpickr(this, config);
        };
    }
    Date.prototype.fp_incr = function (days) {
        return new Date(this.getFullYear(), this.getMonth(), this.getDate() + (typeof days === "string" ? parseInt(days, 10) : days));
    };
    if (typeof window !== "undefined") {
        window.flatpickr = flatpickr;
    }

    /* node_modules/svelte-flatpickr/src/Flatpickr.svelte generated by Svelte v3.46.4 */
    const file$5 = "node_modules/svelte-flatpickr/src/Flatpickr.svelte";

    // (93:6)   
    function fallback_block(ctx) {
    	let input_1;
    	let input_1_levels = [/*$$restProps*/ ctx[1]];
    	let input_1_data = {};

    	for (let i = 0; i < input_1_levels.length; i += 1) {
    		input_1_data = assign(input_1_data, input_1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input_1 = element("input");
    			set_attributes(input_1, input_1_data);
    			add_location(input_1, file$5, 93, 1, 1788);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input_1, anchor);
    			if (input_1.autofocus) input_1.focus();
    			/*input_1_binding*/ ctx[11](input_1);
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input_1, input_1_data = get_spread_update(input_1_levels, [dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1]]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input_1);
    			/*input_1_binding*/ ctx[11](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(93:6)   ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*$$restProps, input*/ 3)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function stripOn(hook) {
    	return hook.charAt(2).toLowerCase() + hook.substring(3);
    }

    function instance$5($$self, $$props, $$invalidate) {
    	const omit_props_names = ["value","formattedValue","element","dateFormat","options","input","flatpickr"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Flatpickr', slots, ['default']);

    	const hooks = new Set([
    			'onChange',
    			'onOpen',
    			'onClose',
    			'onMonthChange',
    			'onYearChange',
    			'onReady',
    			'onValueUpdate',
    			'onDayCreate'
    		]);

    	let { value = '', formattedValue = '', element = null, dateFormat = null } = $$props;
    	let { options = {} } = $$props;
    	let ready = false;
    	let { input = undefined, flatpickr: fp = undefined } = $$props;

    	onMount(() => {
    		const elem = element || input;
    		const opts = addHooks(options);

    		opts.onReady.push(() => {
    			$$invalidate(8, ready = true);
    		});

    		$$invalidate(3, fp = flatpickr(elem, Object.assign(opts, element ? { wrap: true } : {})));

    		return () => {
    			fp.destroy();
    		};
    	});

    	const dispatch = createEventDispatcher();

    	function addHooks(opts = {}) {
    		opts = Object.assign({}, opts);

    		for (const hook of hooks) {
    			const firer = (selectedDates, dateStr, instance) => {
    				dispatch(stripOn(hook), [selectedDates, dateStr, instance]);
    			};

    			if (hook in opts) {
    				// Hooks must be arrays
    				if (!Array.isArray(opts[hook])) opts[hook] = [opts[hook]];

    				opts[hook].push(firer);
    			} else {
    				opts[hook] = [firer];
    			}
    		}

    		if (opts.onChange && !opts.onChange.includes(updateValue)) opts.onChange.push(updateValue);
    		return opts;
    	}

    	function updateValue(newValue, dateStr, fp) {
    		const mode = fp?.config?.mode ?? 'single';
    		$$invalidate(2, value = mode === 'single' ? newValue[0] : newValue);
    		$$invalidate(4, formattedValue = dateStr);
    	}

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(0, input);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('value' in $$new_props) $$invalidate(2, value = $$new_props.value);
    		if ('formattedValue' in $$new_props) $$invalidate(4, formattedValue = $$new_props.formattedValue);
    		if ('element' in $$new_props) $$invalidate(5, element = $$new_props.element);
    		if ('dateFormat' in $$new_props) $$invalidate(6, dateFormat = $$new_props.dateFormat);
    		if ('options' in $$new_props) $$invalidate(7, options = $$new_props.options);
    		if ('input' in $$new_props) $$invalidate(0, input = $$new_props.input);
    		if ('flatpickr' in $$new_props) $$invalidate(3, fp = $$new_props.flatpickr);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		flatpickr,
    		hooks,
    		value,
    		formattedValue,
    		element,
    		dateFormat,
    		options,
    		ready,
    		input,
    		fp,
    		dispatch,
    		addHooks,
    		updateValue,
    		stripOn
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('value' in $$props) $$invalidate(2, value = $$new_props.value);
    		if ('formattedValue' in $$props) $$invalidate(4, formattedValue = $$new_props.formattedValue);
    		if ('element' in $$props) $$invalidate(5, element = $$new_props.element);
    		if ('dateFormat' in $$props) $$invalidate(6, dateFormat = $$new_props.dateFormat);
    		if ('options' in $$props) $$invalidate(7, options = $$new_props.options);
    		if ('ready' in $$props) $$invalidate(8, ready = $$new_props.ready);
    		if ('input' in $$props) $$invalidate(0, input = $$new_props.input);
    		if ('fp' in $$props) $$invalidate(3, fp = $$new_props.fp);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*fp, ready, value, dateFormat*/ 332) {
    			if (fp && ready) {
    				fp.setDate(value, false, dateFormat);
    			}
    		}

    		if ($$self.$$.dirty & /*fp, ready, options*/ 392) {
    			if (fp && ready) {
    				for (const [key, val] of Object.entries(addHooks(options))) {
    					fp.set(key, val);
    				}
    			}
    		}
    	};

    	return [
    		input,
    		$$restProps,
    		value,
    		fp,
    		formattedValue,
    		element,
    		dateFormat,
    		options,
    		ready,
    		$$scope,
    		slots,
    		input_1_binding
    	];
    }

    class Flatpickr extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$6, safe_not_equal, {
    			value: 2,
    			formattedValue: 4,
    			element: 5,
    			dateFormat: 6,
    			options: 7,
    			input: 0,
    			flatpickr: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Flatpickr",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get value() {
    		throw new Error("<Flatpickr>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Flatpickr>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formattedValue() {
    		throw new Error("<Flatpickr>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formattedValue(value) {
    		throw new Error("<Flatpickr>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<Flatpickr>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Flatpickr>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dateFormat() {
    		throw new Error("<Flatpickr>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dateFormat(value) {
    		throw new Error("<Flatpickr>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<Flatpickr>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Flatpickr>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get input() {
    		throw new Error("<Flatpickr>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input(value) {
    		throw new Error("<Flatpickr>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flatpickr() {
    		throw new Error("<Flatpickr>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flatpickr(value) {
    		throw new Error("<Flatpickr>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Harvest.svelte generated by Svelte v3.46.4 */

    const { console: console_1 } = globals;
    const file$4 = "src/components/Harvest.svelte";

    // (95:6) <Label>
    function create_default_slot_4$1(ctx) {
    	let t_value = /*segment*/ ctx[19] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*segment*/ 524288 && t_value !== (t_value = /*segment*/ ctx[19] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(95:6) <Label>",
    		ctx
    	});

    	return block;
    }

    // (94:4) <Segment {segment}>
    function create_default_slot_3$1(ctx) {
    	let label;
    	let current;

    	label = new Label({
    			props: {
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_changes = {};

    			if (dirty & /*$$scope, segment*/ 1572864) {
    				label_changes.$$scope = { dirty, ctx };
    			}

    			label.$set(label_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(94:4) <Segment {segment}>",
    		ctx
    	});

    	return block;
    }

    // (93:2) <SegmentedButton segments={choices} let:segment singleSelect bind:selected>
    function create_default_slot_2$1(ctx) {
    	let segment;
    	let current;

    	segment = new Segment({
    			props: {
    				segment: /*segment*/ ctx[19],
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(segment.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(segment, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const segment_changes = {};
    			if (dirty & /*segment*/ 524288) segment_changes.segment = /*segment*/ ctx[19];

    			if (dirty & /*$$scope, segment*/ 1572864) {
    				segment_changes.$$scope = { dirty, ctx };
    			}

    			segment.$set(segment_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(segment.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(segment.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(segment, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(93:2) <SegmentedButton segments={choices} let:segment singleSelect bind:selected>",
    		ctx
    	});

    	return block;
    }

    // (98:2) {#if showDatePicker}
    function create_if_block_1(ctx) {
    	let span;
    	let t1;
    	let flatpickr;
    	let updating_value;
    	let updating_formattedValue;
    	let current;

    	function flatpickr_value_binding(value) {
    		/*flatpickr_value_binding*/ ctx[13](value);
    	}

    	function flatpickr_formattedValue_binding(value) {
    		/*flatpickr_formattedValue_binding*/ ctx[14](value);
    	}

    	let flatpickr_props = {
    		options: /*options*/ ctx[8],
    		name: "date"
    	};

    	if (/*value*/ ctx[5] !== void 0) {
    		flatpickr_props.value = /*value*/ ctx[5];
    	}

    	if (/*formattedValue*/ ctx[6] !== void 0) {
    		flatpickr_props.formattedValue = /*formattedValue*/ ctx[6];
    	}

    	flatpickr = new Flatpickr({ props: flatpickr_props, $$inline: true });
    	binding_callbacks.push(() => bind(flatpickr, 'value', flatpickr_value_binding));
    	binding_callbacks.push(() => bind(flatpickr, 'formattedValue', flatpickr_formattedValue_binding));
    	flatpickr.$on("change", handleChange);

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Wybierz przedział:";
    			t1 = space();
    			create_component(flatpickr.$$.fragment);
    			add_location(span, file$4, 98, 4, 3172);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(flatpickr, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const flatpickr_changes = {};

    			if (!updating_value && dirty & /*value*/ 32) {
    				updating_value = true;
    				flatpickr_changes.value = /*value*/ ctx[5];
    				add_flush_callback(() => updating_value = false);
    			}

    			if (!updating_formattedValue && dirty & /*formattedValue*/ 64) {
    				updating_formattedValue = true;
    				flatpickr_changes.formattedValue = /*formattedValue*/ ctx[6];
    				add_flush_callback(() => updating_formattedValue = false);
    			}

    			flatpickr.$set(flatpickr_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flatpickr.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flatpickr.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			destroy_component(flatpickr, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(98:2) {#if showDatePicker}",
    		ctx
    	});

    	return block;
    }

    // (102:2) {#if harvestDataFetched}
    function create_if_block$1(ctx) {
    	let await_block_anchor;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 17,
    		error: 18,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*request*/ ctx[1], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*request*/ 2 && promise !== (promise = /*request*/ ctx[1]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(102:2) {#if harvestDataFetched}",
    		ctx
    	});

    	return block;
    }

    // (119:4) {:catch error}
    function create_catch_block(ctx) {
    	let p;
    	let t_value = /*error*/ ctx[18].message + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			set_style(p, "color", "red");
    			add_location(p, file$4, 119, 6, 3857);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*request*/ 2 && t_value !== (t_value = /*error*/ ctx[18].message + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(119:4) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (105:4) {:then timeEntries}
    function create_then_block(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*timeEntries*/ ctx[17]?.length + "";
    	let t1;
    	let t2;
    	let t3;
    	let div;
    	let textfield;
    	let updating_value;
    	let t4;
    	let iconbutton;
    	let current;

    	function textfield_value_binding(value) {
    		/*textfield_value_binding*/ ctx[15](value);
    	}

    	let textfield_props = {
    		style: "width: 100%;",
    		textarea: true,
    		variant: "outlined",
    		label: "Skrypt do teamdecka"
    	};

    	if (/*teamdeckScript*/ ctx[3] !== void 0) {
    		textfield_props.value = /*teamdeckScript*/ ctx[3];
    	}

    	textfield = new Textfield({ props: textfield_props, $$inline: true });
    	binding_callbacks.push(() => bind(textfield, 'value', textfield_value_binding));

    	iconbutton = new IconButton({
    			props: {
    				class: "material-icons",
    				"aria-label": "Copy content",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	iconbutton.$on("click", /*copyToClipboard*/ ctx[10]);

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Pobrano ");
    			t1 = text(t1_value);
    			t2 = text(" wpisów");
    			t3 = space();
    			div = element("div");
    			create_component(textfield.$$.fragment);
    			t4 = space();
    			create_component(iconbutton.$$.fragment);
    			add_location(p, file$4, 105, 6, 3411);
    			attr_dev(div, "class", "textarea-wrapper svelte-gh3rf3");
    			add_location(div, file$4, 106, 6, 3461);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(textfield, div, null);
    			append_dev(div, t4);
    			mount_component(iconbutton, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*request*/ 2) && t1_value !== (t1_value = /*timeEntries*/ ctx[17]?.length + "")) set_data_dev(t1, t1_value);
    			const textfield_changes = {};

    			if (!updating_value && dirty & /*teamdeckScript*/ 8) {
    				updating_value = true;
    				textfield_changes.value = /*teamdeckScript*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			textfield.$set(textfield_changes);
    			const iconbutton_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				iconbutton_changes.$$scope = { dirty, ctx };
    			}

    			iconbutton.$set(iconbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textfield.$$.fragment, local);
    			transition_in(iconbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textfield.$$.fragment, local);
    			transition_out(iconbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div);
    			destroy_component(textfield);
    			destroy_component(iconbutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(105:4) {:then timeEntries}",
    		ctx
    	});

    	return block;
    }

    // (115:8) <IconButton class="material-icons" aria-label="Copy content" on:click={copyToClipboard}           >
    function create_default_slot_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("content_copy");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(115:8) <IconButton class=\\\"material-icons\\\" aria-label=\\\"Copy content\\\" on:click={copyToClipboard}           >",
    		ctx
    	});

    	return block;
    }

    // (103:20)        <p>...Pobieram</p>     {:then timeEntries}
    function create_pending_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "...Pobieram";
    			add_location(p, file$4, 103, 6, 3362);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(103:20)        <p>...Pobieram</p>     {:then timeEntries}",
    		ctx
    	});

    	return block;
    }

    // (124:2) <Button variant="raised" on:click={fetchData}>
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Pobierz dane");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(124:2) <Button variant=\\\"raised\\\" on:click={fetchData}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let h3;
    	let t1;
    	let segmentedbutton;
    	let updating_selected;
    	let t2;
    	let t3;
    	let t4;
    	let button;
    	let current;

    	function segmentedbutton_selected_binding(value) {
    		/*segmentedbutton_selected_binding*/ ctx[12](value);
    	}

    	let segmentedbutton_props = {
    		segments: /*choices*/ ctx[7],
    		singleSelect: true,
    		$$slots: {
    			default: [
    				create_default_slot_2$1,
    				({ segment }) => ({ 19: segment }),
    				({ segment }) => segment ? 524288 : 0
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*selected*/ ctx[0] !== void 0) {
    		segmentedbutton_props.selected = /*selected*/ ctx[0];
    	}

    	segmentedbutton = new SegmentedButton({
    			props: segmentedbutton_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(segmentedbutton, 'selected', segmentedbutton_selected_binding));
    	let if_block0 = /*showDatePicker*/ ctx[4] && create_if_block_1(ctx);
    	let if_block1 = /*harvestDataFetched*/ ctx[2] && create_if_block$1(ctx);

    	button = new Button_1({
    			props: {
    				variant: "raised",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*fetchData*/ ctx[9]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "Harvest";
    			t1 = space();
    			create_component(segmentedbutton.$$.fragment);
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if (if_block1) if_block1.c();
    			t4 = space();
    			create_component(button.$$.fragment);
    			add_location(h3, file$4, 91, 2, 2959);
    			attr_dev(div, "class", "section-wrapper svelte-gh3rf3");
    			add_location(div, file$4, 90, 0, 2927);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t1);
    			mount_component(segmentedbutton, div, null);
    			append_dev(div, t2);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t3);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t4);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const segmentedbutton_changes = {};

    			if (dirty & /*$$scope, segment*/ 1572864) {
    				segmentedbutton_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_selected && dirty & /*selected*/ 1) {
    				updating_selected = true;
    				segmentedbutton_changes.selected = /*selected*/ ctx[0];
    				add_flush_callback(() => updating_selected = false);
    			}

    			segmentedbutton.$set(segmentedbutton_changes);

    			if (/*showDatePicker*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*showDatePicker*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t3);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*harvestDataFetched*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*harvestDataFetched*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, t4);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(segmentedbutton.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(segmentedbutton.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(segmentedbutton);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function handleChange(event) {
    	const [selectedDates, dateStr] = event.detail;
    	console.log({ selectedDates, dateStr });
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Harvest', slots, []);
    	let choices = ['Dzisiaj', 'Wczoraj', 'Ostatnie 2 dni', 'Ostatni tydzień', 'Własny zakres'];
    	let selected = 'Dzisiaj';
    	let { harvestApiData } = $$props;
    	let request;
    	let harvestDataFetched = false;
    	let teamdeckScript = '';
    	let showDatePicker = false;
    	let value, formattedValue;
    	let selectedDates = [];

    	const options = {
    		enableTime: false,
    		mode: 'range',
    		onChange(selectedDateRange, dateStr) {
    			selectedDates = selectedDateRange;
    		}
    	};

    	const fetchData = () => {
    		$$invalidate(2, harvestDataFetched = true);
    		let from = new Date();
    		let to = new Date();

    		if (selected === choices[0]) {
    			from = dayjs_min().startOf('day').toDate();
    		}

    		if (selected === choices[1]) {
    			from = dayjs_min().subtract(2, 'day').startOf('day').toDate();
    			to = dayjs_min().subtract(1, 'day').startOf('day').toDate();
    		}

    		if (selected === choices[2]) {
    			from = dayjs_min().subtract(2, 'day').startOf('day').toDate();
    		}

    		if (selected === choices[3]) {
    			from = dayjs_min().subtract(7, 'day').startOf('day').toDate();
    		}

    		if (selected === choices[4]) {
    			from = dayjs_min(selectedDates[0]).startOf('day').toDate();
    			to = dayjs_min(selectedDates[1]).startOf('day').toDate();
    		}

    		const params = new URLSearchParams({
    				from: from.toISOString(),
    				to: to.toISOString()
    			});

    		$$invalidate(1, request = fetch('https://api.harvestapp.com/api/v2/time_entries?' + params, {
    			headers: {
    				Authorization: `Bearer ${harvestApiData.token}`,
    				'Harvest-Account-Id': harvestApiData.accountId,
    				'User-Agent': 'Harvest API Example'
    			}
    		}).then(res => res.json()).then(res => res.time_entries.map(entry => ({
    			minutes: Math.round(entry.hours * 60),
    			project: projectNameToProjectId(entry.project.name),
    			name: entry.notes,
    			date: entry.spent_date,
    			tag: taskToTagId(entry.task.id)
    		}))).then(res => {
    			$$invalidate(3, teamdeckScript = generateTeamdeckScriptFromHarvest(res));
    			return res;
    		}));
    	};

    	const copyToClipboard = () => {
    		console.log('kopiuj');
    		navigator.clipboard.writeText(teamdeckScript);
    	};

    	const writable_props = ['harvestApiData'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Harvest> was created with unknown prop '${key}'`);
    	});

    	function segmentedbutton_selected_binding(value) {
    		selected = value;
    		$$invalidate(0, selected);
    	}

    	function flatpickr_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(5, value);
    	}

    	function flatpickr_formattedValue_binding(value) {
    		formattedValue = value;
    		$$invalidate(6, formattedValue);
    	}

    	function textfield_value_binding(value) {
    		teamdeckScript = value;
    		($$invalidate(3, teamdeckScript), $$invalidate(0, selected));
    	}

    	$$self.$$set = $$props => {
    		if ('harvestApiData' in $$props) $$invalidate(11, harvestApiData = $$props.harvestApiData);
    	};

    	$$self.$capture_state = () => ({
    		Textfield,
    		Button: Button_1,
    		SegmentedButton,
    		Segment,
    		Label,
    		taskToTagId,
    		projectNameToProjectId,
    		generateTeamdeckScriptFromHarvest,
    		dayjs: dayjs_min,
    		IconButton,
    		Flatpickr,
    		choices,
    		selected,
    		harvestApiData,
    		request,
    		harvestDataFetched,
    		teamdeckScript,
    		showDatePicker,
    		value,
    		formattedValue,
    		selectedDates,
    		options,
    		handleChange,
    		fetchData,
    		copyToClipboard
    	});

    	$$self.$inject_state = $$props => {
    		if ('choices' in $$props) $$invalidate(7, choices = $$props.choices);
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('harvestApiData' in $$props) $$invalidate(11, harvestApiData = $$props.harvestApiData);
    		if ('request' in $$props) $$invalidate(1, request = $$props.request);
    		if ('harvestDataFetched' in $$props) $$invalidate(2, harvestDataFetched = $$props.harvestDataFetched);
    		if ('teamdeckScript' in $$props) $$invalidate(3, teamdeckScript = $$props.teamdeckScript);
    		if ('showDatePicker' in $$props) $$invalidate(4, showDatePicker = $$props.showDatePicker);
    		if ('value' in $$props) $$invalidate(5, value = $$props.value);
    		if ('formattedValue' in $$props) $$invalidate(6, formattedValue = $$props.formattedValue);
    		if ('selectedDates' in $$props) selectedDates = $$props.selectedDates;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*selected*/ 1) {
    			{
    				if (selected === 'Własny zakres') {
    					$$invalidate(4, showDatePicker = true);
    				} else {
    					$$invalidate(4, showDatePicker = false);
    				}

    				$$invalidate(3, teamdeckScript = '');
    				$$invalidate(2, harvestDataFetched = false);
    			}
    		}
    	};

    	return [
    		selected,
    		request,
    		harvestDataFetched,
    		teamdeckScript,
    		showDatePicker,
    		value,
    		formattedValue,
    		choices,
    		options,
    		fetchData,
    		copyToClipboard,
    		harvestApiData,
    		segmentedbutton_selected_binding,
    		flatpickr_value_binding,
    		flatpickr_formattedValue_binding,
    		textfield_value_binding
    	];
    }

    class Harvest extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$5, safe_not_equal, { harvestApiData: 11 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Harvest",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*harvestApiData*/ ctx[11] === undefined && !('harvestApiData' in props)) {
    			console_1.warn("<Harvest> was created without expected prop 'harvestApiData'");
    		}
    	}

    	get harvestApiData() {
    		throw new Error("<Harvest>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set harvestApiData(value) {
    		throw new Error("<Harvest>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/modules/home/Home.svelte generated by Svelte v3.46.4 */
    const file$3 = "src/modules/home/Home.svelte";

    // (9:2) {:else}
    function create_else_block(ctx) {
    	let p;
    	let t0;
    	let a;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Brak danych do harvesta, ustaw je w ");
    			a = element("a");
    			a.textContent = "ustawieniach";
    			attr_dev(a, "href", "#/settings");
    			add_location(a, file$3, 9, 43, 298);
    			add_location(p, file$3, 9, 4, 259);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, a);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(9:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (7:2) {#if harvestApiData}
    function create_if_block(ctx) {
    	let harvest;
    	let current;

    	harvest = new Harvest({
    			props: {
    				harvestApiData: /*harvestApiData*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(harvest.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(harvest, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(harvest.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(harvest.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(harvest, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(7:2) {#if harvestApiData}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let section;
    	let h1;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*harvestApiData*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			h1.textContent = "Generuj skrypt";
    			t1 = space();
    			if_block.c();
    			add_location(h1, file$3, 5, 2, 165);
    			attr_dev(section, "class", "svelte-kenrjf");
    			add_location(section, file$3, 4, 0, 153);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(section, t1);
    			if_blocks[current_block_type_index].m(section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let harvestApiData = JSON.parse(localStorage.getItem('harvestAPI'));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Harvest, harvestApiData });

    	$$self.$inject_state = $$props => {
    		if ('harvestApiData' in $$props) $$invalidate(0, harvestApiData = $$props.harvestApiData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [harvestApiData];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    const routes = {
        '/': Home,
        '/settings': Settings,
        '*': Settings,
    };

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses = {
        FIXED_CLASS: 'mdc-top-app-bar--fixed',
        FIXED_SCROLLED_CLASS: 'mdc-top-app-bar--fixed-scrolled',
        SHORT_CLASS: 'mdc-top-app-bar--short',
        SHORT_COLLAPSED_CLASS: 'mdc-top-app-bar--short-collapsed',
        SHORT_HAS_ACTION_ITEM_CLASS: 'mdc-top-app-bar--short-has-action-item',
    };
    var numbers = {
        DEBOUNCE_THROTTLE_RESIZE_TIME_MS: 100,
        MAX_TOP_APP_BAR_HEIGHT: 128,
    };
    var strings = {
        ACTION_ITEM_SELECTOR: '.mdc-top-app-bar__action-item',
        NAVIGATION_EVENT: 'MDCTopAppBar:nav',
        NAVIGATION_ICON_SELECTOR: '.mdc-top-app-bar__navigation-icon',
        ROOT_SELECTOR: '.mdc-top-app-bar',
        TITLE_SELECTOR: '.mdc-top-app-bar__title',
    };

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCTopAppBarBaseFoundation = /** @class */ (function (_super) {
        __extends(MDCTopAppBarBaseFoundation, _super);
        /* istanbul ignore next: optional argument is not a branch statement */
        function MDCTopAppBarBaseFoundation(adapter) {
            return _super.call(this, __assign$1(__assign$1({}, MDCTopAppBarBaseFoundation.defaultAdapter), adapter)) || this;
        }
        Object.defineProperty(MDCTopAppBarBaseFoundation, "strings", {
            get: function () {
                return strings;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTopAppBarBaseFoundation, "cssClasses", {
            get: function () {
                return cssClasses;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTopAppBarBaseFoundation, "numbers", {
            get: function () {
                return numbers;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTopAppBarBaseFoundation, "defaultAdapter", {
            /**
             * See {@link MDCTopAppBarAdapter} for typing information on parameters and return types.
             */
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
                return {
                    addClass: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    hasClass: function () { return false; },
                    setStyle: function () { return undefined; },
                    getTopAppBarHeight: function () { return 0; },
                    notifyNavigationIconClicked: function () { return undefined; },
                    getViewportScrollY: function () { return 0; },
                    getTotalActionItems: function () { return 0; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        /** Other variants of TopAppBar foundation overrides this method */
        MDCTopAppBarBaseFoundation.prototype.handleTargetScroll = function () { }; // tslint:disable-line:no-empty
        /** Other variants of TopAppBar foundation overrides this method */
        MDCTopAppBarBaseFoundation.prototype.handleWindowResize = function () { }; // tslint:disable-line:no-empty
        MDCTopAppBarBaseFoundation.prototype.handleNavigationClick = function () {
            this.adapter.notifyNavigationIconClicked();
        };
        return MDCTopAppBarBaseFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var INITIAL_VALUE = 0;
    var MDCTopAppBarFoundation = /** @class */ (function (_super) {
        __extends(MDCTopAppBarFoundation, _super);
        /* istanbul ignore next: optional argument is not a branch statement */
        function MDCTopAppBarFoundation(adapter) {
            var _this = _super.call(this, adapter) || this;
            /**
             * Indicates if the top app bar was docked in the previous scroll handler iteration.
             */
            _this.wasDocked = true;
            /**
             * Indicates if the top app bar is docked in the fully shown position.
             */
            _this.isDockedShowing = true;
            /**
             * Variable for current scroll position of the top app bar
             */
            _this.currentAppBarOffsetTop = 0;
            /**
             * Used to prevent the top app bar from being scrolled out of view during resize events
             */
            _this.isCurrentlyBeingResized = false;
            /**
             * The timeout that's used to throttle the resize events
             */
            _this.resizeThrottleId = INITIAL_VALUE;
            /**
             * The timeout that's used to debounce toggling the isCurrentlyBeingResized
             * variable after a resize
             */
            _this.resizeDebounceId = INITIAL_VALUE;
            _this.lastScrollPosition = _this.adapter.getViewportScrollY();
            _this.topAppBarHeight = _this.adapter.getTopAppBarHeight();
            return _this;
        }
        MDCTopAppBarFoundation.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this.adapter.setStyle('top', '');
        };
        /**
         * Scroll handler for the default scroll behavior of the top app bar.
         * @override
         */
        MDCTopAppBarFoundation.prototype.handleTargetScroll = function () {
            var currentScrollPosition = Math.max(this.adapter.getViewportScrollY(), 0);
            var diff = currentScrollPosition - this.lastScrollPosition;
            this.lastScrollPosition = currentScrollPosition;
            // If the window is being resized the lastScrollPosition needs to be updated
            // but the current scroll of the top app bar should stay in the same
            // position.
            if (!this.isCurrentlyBeingResized) {
                this.currentAppBarOffsetTop -= diff;
                if (this.currentAppBarOffsetTop > 0) {
                    this.currentAppBarOffsetTop = 0;
                }
                else if (Math.abs(this.currentAppBarOffsetTop) > this.topAppBarHeight) {
                    this.currentAppBarOffsetTop = -this.topAppBarHeight;
                }
                this.moveTopAppBar();
            }
        };
        /**
         * Top app bar resize handler that throttle/debounce functions that execute updates.
         * @override
         */
        MDCTopAppBarFoundation.prototype.handleWindowResize = function () {
            var _this = this;
            // Throttle resize events 10 p/s
            if (!this.resizeThrottleId) {
                this.resizeThrottleId = setTimeout(function () {
                    _this.resizeThrottleId = INITIAL_VALUE;
                    _this.throttledResizeHandler();
                }, numbers.DEBOUNCE_THROTTLE_RESIZE_TIME_MS);
            }
            this.isCurrentlyBeingResized = true;
            if (this.resizeDebounceId) {
                clearTimeout(this.resizeDebounceId);
            }
            this.resizeDebounceId = setTimeout(function () {
                _this.handleTargetScroll();
                _this.isCurrentlyBeingResized = false;
                _this.resizeDebounceId = INITIAL_VALUE;
            }, numbers.DEBOUNCE_THROTTLE_RESIZE_TIME_MS);
        };
        /**
         * Function to determine if the DOM needs to update.
         */
        MDCTopAppBarFoundation.prototype.checkForUpdate = function () {
            var offscreenBoundaryTop = -this.topAppBarHeight;
            var hasAnyPixelsOffscreen = this.currentAppBarOffsetTop < 0;
            var hasAnyPixelsOnscreen = this.currentAppBarOffsetTop > offscreenBoundaryTop;
            var partiallyShowing = hasAnyPixelsOffscreen && hasAnyPixelsOnscreen;
            // If it's partially showing, it can't be docked.
            if (partiallyShowing) {
                this.wasDocked = false;
            }
            else {
                // Not previously docked and not partially showing, it's now docked.
                if (!this.wasDocked) {
                    this.wasDocked = true;
                    return true;
                }
                else if (this.isDockedShowing !== hasAnyPixelsOnscreen) {
                    this.isDockedShowing = hasAnyPixelsOnscreen;
                    return true;
                }
            }
            return partiallyShowing;
        };
        /**
         * Function to move the top app bar if needed.
         */
        MDCTopAppBarFoundation.prototype.moveTopAppBar = function () {
            if (this.checkForUpdate()) {
                // Once the top app bar is fully hidden we use the max potential top app bar height as our offset
                // so the top app bar doesn't show if the window resizes and the new height > the old height.
                var offset = this.currentAppBarOffsetTop;
                if (Math.abs(offset) >= this.topAppBarHeight) {
                    offset = -numbers.MAX_TOP_APP_BAR_HEIGHT;
                }
                this.adapter.setStyle('top', offset + 'px');
            }
        };
        /**
         * Throttled function that updates the top app bar scrolled values if the
         * top app bar height changes.
         */
        MDCTopAppBarFoundation.prototype.throttledResizeHandler = function () {
            var currentHeight = this.adapter.getTopAppBarHeight();
            if (this.topAppBarHeight !== currentHeight) {
                this.wasDocked = false;
                // Since the top app bar has a different height depending on the screen width, this
                // will ensure that the top app bar remains in the correct location if
                // completely hidden and a resize makes the top app bar a different height.
                this.currentAppBarOffsetTop -= this.topAppBarHeight - currentHeight;
                this.topAppBarHeight = currentHeight;
            }
            this.handleTargetScroll();
        };
        return MDCTopAppBarFoundation;
    }(MDCTopAppBarBaseFoundation));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCFixedTopAppBarFoundation = /** @class */ (function (_super) {
        __extends(MDCFixedTopAppBarFoundation, _super);
        function MDCFixedTopAppBarFoundation() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * State variable for the previous scroll iteration top app bar state
             */
            _this.wasScrolled = false;
            return _this;
        }
        /**
         * Scroll handler for applying/removing the modifier class on the fixed top app bar.
         * @override
         */
        MDCFixedTopAppBarFoundation.prototype.handleTargetScroll = function () {
            var currentScroll = this.adapter.getViewportScrollY();
            if (currentScroll <= 0) {
                if (this.wasScrolled) {
                    this.adapter.removeClass(cssClasses.FIXED_SCROLLED_CLASS);
                    this.wasScrolled = false;
                }
            }
            else {
                if (!this.wasScrolled) {
                    this.adapter.addClass(cssClasses.FIXED_SCROLLED_CLASS);
                    this.wasScrolled = true;
                }
            }
        };
        return MDCFixedTopAppBarFoundation;
    }(MDCTopAppBarFoundation));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCShortTopAppBarFoundation = /** @class */ (function (_super) {
        __extends(MDCShortTopAppBarFoundation, _super);
        /* istanbul ignore next: optional argument is not a branch statement */
        function MDCShortTopAppBarFoundation(adapter) {
            var _this = _super.call(this, adapter) || this;
            _this.collapsed = false;
            _this.isAlwaysCollapsed = false;
            return _this;
        }
        Object.defineProperty(MDCShortTopAppBarFoundation.prototype, "isCollapsed", {
            // Public visibility for backward compatibility.
            get: function () {
                return this.collapsed;
            },
            enumerable: false,
            configurable: true
        });
        MDCShortTopAppBarFoundation.prototype.init = function () {
            _super.prototype.init.call(this);
            if (this.adapter.getTotalActionItems() > 0) {
                this.adapter.addClass(cssClasses.SHORT_HAS_ACTION_ITEM_CLASS);
            }
            // If initialized with SHORT_COLLAPSED_CLASS, the bar should always be collapsed
            this.setAlwaysCollapsed(this.adapter.hasClass(cssClasses.SHORT_COLLAPSED_CLASS));
        };
        /**
         * Set if the short top app bar should always be collapsed.
         *
         * @param value When `true`, bar will always be collapsed. When `false`, bar may collapse or expand based on scroll.
         */
        MDCShortTopAppBarFoundation.prototype.setAlwaysCollapsed = function (value) {
            this.isAlwaysCollapsed = !!value;
            if (this.isAlwaysCollapsed) {
                this.collapse();
            }
            else {
                // let maybeCollapseBar determine if the bar should be collapsed
                this.maybeCollapseBar();
            }
        };
        MDCShortTopAppBarFoundation.prototype.getAlwaysCollapsed = function () {
            return this.isAlwaysCollapsed;
        };
        /**
         * Scroll handler for applying/removing the collapsed modifier class on the short top app bar.
         * @override
         */
        MDCShortTopAppBarFoundation.prototype.handleTargetScroll = function () {
            this.maybeCollapseBar();
        };
        MDCShortTopAppBarFoundation.prototype.maybeCollapseBar = function () {
            if (this.isAlwaysCollapsed) {
                return;
            }
            var currentScroll = this.adapter.getViewportScrollY();
            if (currentScroll <= 0) {
                if (this.collapsed) {
                    this.uncollapse();
                }
            }
            else {
                if (!this.collapsed) {
                    this.collapse();
                }
            }
        };
        MDCShortTopAppBarFoundation.prototype.uncollapse = function () {
            this.adapter.removeClass(cssClasses.SHORT_COLLAPSED_CLASS);
            this.collapsed = false;
        };
        MDCShortTopAppBarFoundation.prototype.collapse = function () {
            this.adapter.addClass(cssClasses.SHORT_COLLAPSED_CLASS);
            this.collapsed = true;
        };
        return MDCShortTopAppBarFoundation;
    }(MDCTopAppBarBaseFoundation));

    /* node_modules/@smui/top-app-bar/dist/TopAppBar.svelte generated by Svelte v3.46.4 */

    const { window: window_1 } = globals;

    const file$2 = "node_modules/@smui/top-app-bar/dist/TopAppBar.svelte";

    function create_fragment$3(ctx) {
    	let header;
    	let header_class_value;
    	let header_style_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[22].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], null);

    	let header_levels = [
    		{
    			class: header_class_value = classMap({
    				[/*className*/ ctx[2]]: true,
    				'mdc-top-app-bar': true,
    				'mdc-top-app-bar--short': /*variant*/ ctx[4] === 'short',
    				'mdc-top-app-bar--short-collapsed': /*collapsed*/ ctx[0],
    				'mdc-top-app-bar--fixed': /*variant*/ ctx[4] === 'fixed',
    				'smui-top-app-bar--static': /*variant*/ ctx[4] === 'static',
    				'smui-top-app-bar--color-secondary': /*color*/ ctx[5] === 'secondary',
    				'mdc-top-app-bar--prominent': /*prominent*/ ctx[6],
    				'mdc-top-app-bar--dense': /*dense*/ ctx[7],
    				.../*internalClasses*/ ctx[11]
    			})
    		},
    		{
    			style: header_style_value = Object.entries(/*internalStyles*/ ctx[12]).map(func).concat([/*style*/ ctx[3]]).join(' ')
    		},
    		/*$$restProps*/ ctx[15]
    	];

    	let header_data = {};

    	for (let i = 0; i < header_levels.length; i += 1) {
    		header_data = assign(header_data, header_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			header = element("header");
    			if (default_slot) default_slot.c();
    			set_attributes(header, header_data);
    			add_location(header, file$2, 9, 0, 208);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);

    			if (default_slot) {
    				default_slot.m(header, null);
    			}

    			/*header_binding*/ ctx[25](header);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "resize", /*resize_handler*/ ctx[23], false, false, false),
    					listen_dev(window_1, "scroll", /*scroll_handler*/ ctx[24], false, false, false),
    					action_destroyer(useActions_action = useActions.call(null, header, /*use*/ ctx[1])),
    					action_destroyer(/*forwardEvents*/ ctx[13].call(null, header)),
    					listen_dev(header, "SMUITopAppBarIconButton:nav", /*SMUITopAppBarIconButton_nav_handler*/ ctx[26], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 2097152)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[21],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[21])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[21], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(header, header_data = get_spread_update(header_levels, [
    				(!current || dirty[0] & /*className, variant, collapsed, color, prominent, dense, internalClasses*/ 2293 && header_class_value !== (header_class_value = classMap({
    					[/*className*/ ctx[2]]: true,
    					'mdc-top-app-bar': true,
    					'mdc-top-app-bar--short': /*variant*/ ctx[4] === 'short',
    					'mdc-top-app-bar--short-collapsed': /*collapsed*/ ctx[0],
    					'mdc-top-app-bar--fixed': /*variant*/ ctx[4] === 'fixed',
    					'smui-top-app-bar--static': /*variant*/ ctx[4] === 'static',
    					'smui-top-app-bar--color-secondary': /*color*/ ctx[5] === 'secondary',
    					'mdc-top-app-bar--prominent': /*prominent*/ ctx[6],
    					'mdc-top-app-bar--dense': /*dense*/ ctx[7],
    					.../*internalClasses*/ ctx[11]
    				}))) && { class: header_class_value },
    				(!current || dirty[0] & /*internalStyles, style*/ 4104 && header_style_value !== (header_style_value = Object.entries(/*internalStyles*/ ctx[12]).map(func).concat([/*style*/ ctx[3]]).join(' '))) && { style: header_style_value },
    				dirty[0] & /*$$restProps*/ 32768 && /*$$restProps*/ ctx[15]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*use*/ 2) useActions_action.update.call(null, /*use*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (default_slot) default_slot.d(detaching);
    			/*header_binding*/ ctx[25](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = ([name, value]) => `${name}: ${value};`;

    function instance_1($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","style","variant","color","collapsed","prominent","dense","scrollTarget","getPropStore","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopAppBar', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());

    	let uninitializedValue = () => {
    		
    	};

    	function isUninitializedValue(value) {
    		return value === uninitializedValue;
    	}

    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
    	let { variant = 'standard' } = $$props;
    	let { color = 'primary' } = $$props;
    	let { collapsed = uninitializedValue } = $$props;
    	const alwaysCollapsed = !isUninitializedValue(collapsed) && !!collapsed;

    	if (isUninitializedValue(collapsed)) {
    		collapsed = false;
    	}

    	let { prominent = false } = $$props;
    	let { dense = false } = $$props;
    	let { scrollTarget = undefined } = $$props;
    	let element;
    	let instance;
    	let internalClasses = {};
    	let internalStyles = {};
    	let propStoreSet;

    	let propStore = readable({ variant, prominent, dense }, set => {
    		$$invalidate(18, propStoreSet = set);
    	});

    	let oldScrollTarget = undefined;
    	let oldVariant = variant;

    	onMount(() => {
    		$$invalidate(9, instance = getInstance());
    		instance.init();

    		return () => {
    			instance.destroy();
    		};
    	});

    	function getInstance() {
    		const Foundation = ({
    			static: MDCTopAppBarBaseFoundation,
    			short: MDCShortTopAppBarFoundation,
    			fixed: MDCFixedTopAppBarFoundation
    		})[variant] || MDCTopAppBarFoundation;

    		return new Foundation({
    				hasClass,
    				addClass,
    				removeClass,
    				setStyle: addStyle,
    				getTopAppBarHeight: () => element.clientHeight,
    				notifyNavigationIconClicked: () => dispatch(element, 'SMUITopAppBar:nav', undefined, undefined, true),
    				getViewportScrollY: () => scrollTarget == null
    				? window.pageYOffset
    				: scrollTarget.scrollTop,
    				getTotalActionItems: () => element.querySelectorAll('.mdc-top-app-bar__action-item').length
    			});
    	}

    	function hasClass(className) {
    		return className in internalClasses
    		? internalClasses[className]
    		: getElement().classList.contains(className);
    	}

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(11, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(11, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addStyle(name, value) {
    		if (internalStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete internalStyles[name];
    				((($$invalidate(12, internalStyles), $$invalidate(20, oldVariant)), $$invalidate(4, variant)), $$invalidate(9, instance));
    			} else {
    				$$invalidate(12, internalStyles[name] = value, internalStyles);
    			}
    		}
    	}

    	function handleTargetScroll() {
    		if (instance) {
    			instance.handleTargetScroll();

    			if (variant === 'short') {
    				$$invalidate(0, collapsed = 'isCollapsed' in instance && instance.isCollapsed);
    			}
    		}
    	}

    	function getPropStore() {
    		return propStore;
    	}

    	function getElement() {
    		return element;
    	}

    	const resize_handler = () => variant !== 'short' && variant !== 'fixed' && instance && instance.handleWindowResize();
    	const scroll_handler = () => scrollTarget == null && handleTargetScroll();

    	function header_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(10, element);
    		});
    	}

    	const SMUITopAppBarIconButton_nav_handler = () => instance && instance.handleNavigationClick();

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(15, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ('variant' in $$new_props) $$invalidate(4, variant = $$new_props.variant);
    		if ('color' in $$new_props) $$invalidate(5, color = $$new_props.color);
    		if ('collapsed' in $$new_props) $$invalidate(0, collapsed = $$new_props.collapsed);
    		if ('prominent' in $$new_props) $$invalidate(6, prominent = $$new_props.prominent);
    		if ('dense' in $$new_props) $$invalidate(7, dense = $$new_props.dense);
    		if ('scrollTarget' in $$new_props) $$invalidate(8, scrollTarget = $$new_props.scrollTarget);
    		if ('$$scope' in $$new_props) $$invalidate(21, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MDCTopAppBarBaseFoundation,
    		MDCTopAppBarFoundation,
    		MDCFixedTopAppBarFoundation,
    		MDCShortTopAppBarFoundation,
    		onMount,
    		get_current_component,
    		readable,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		dispatch,
    		forwardEvents,
    		uninitializedValue,
    		isUninitializedValue,
    		use,
    		className,
    		style,
    		variant,
    		color,
    		collapsed,
    		alwaysCollapsed,
    		prominent,
    		dense,
    		scrollTarget,
    		element,
    		instance,
    		internalClasses,
    		internalStyles,
    		propStoreSet,
    		propStore,
    		oldScrollTarget,
    		oldVariant,
    		getInstance,
    		hasClass,
    		addClass,
    		removeClass,
    		addStyle,
    		handleTargetScroll,
    		getPropStore,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('uninitializedValue' in $$props) uninitializedValue = $$new_props.uninitializedValue;
    		if ('use' in $$props) $$invalidate(1, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(3, style = $$new_props.style);
    		if ('variant' in $$props) $$invalidate(4, variant = $$new_props.variant);
    		if ('color' in $$props) $$invalidate(5, color = $$new_props.color);
    		if ('collapsed' in $$props) $$invalidate(0, collapsed = $$new_props.collapsed);
    		if ('prominent' in $$props) $$invalidate(6, prominent = $$new_props.prominent);
    		if ('dense' in $$props) $$invalidate(7, dense = $$new_props.dense);
    		if ('scrollTarget' in $$props) $$invalidate(8, scrollTarget = $$new_props.scrollTarget);
    		if ('element' in $$props) $$invalidate(10, element = $$new_props.element);
    		if ('instance' in $$props) $$invalidate(9, instance = $$new_props.instance);
    		if ('internalClasses' in $$props) $$invalidate(11, internalClasses = $$new_props.internalClasses);
    		if ('internalStyles' in $$props) $$invalidate(12, internalStyles = $$new_props.internalStyles);
    		if ('propStoreSet' in $$props) $$invalidate(18, propStoreSet = $$new_props.propStoreSet);
    		if ('propStore' in $$props) propStore = $$new_props.propStore;
    		if ('oldScrollTarget' in $$props) $$invalidate(19, oldScrollTarget = $$new_props.oldScrollTarget);
    		if ('oldVariant' in $$props) $$invalidate(20, oldVariant = $$new_props.oldVariant);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*propStoreSet, variant, prominent, dense*/ 262352) {
    			if (propStoreSet) {
    				propStoreSet({ variant, prominent, dense });
    			}
    		}

    		if ($$self.$$.dirty[0] & /*oldVariant, variant, instance*/ 1049104) {
    			if (oldVariant !== variant && instance) {
    				$$invalidate(20, oldVariant = variant);
    				instance.destroy();
    				$$invalidate(11, internalClasses = {});
    				$$invalidate(12, internalStyles = {});
    				$$invalidate(9, instance = getInstance());
    				instance.init();
    			}
    		}

    		if ($$self.$$.dirty[0] & /*instance, variant*/ 528) {
    			if (instance && variant === 'short' && 'setAlwaysCollapsed' in instance) {
    				instance.setAlwaysCollapsed(alwaysCollapsed);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*oldScrollTarget, scrollTarget*/ 524544) {
    			if (oldScrollTarget !== scrollTarget) {
    				if (oldScrollTarget) {
    					oldScrollTarget.removeEventListener('scroll', handleTargetScroll);
    				}

    				if (scrollTarget) {
    					scrollTarget.addEventListener('scroll', handleTargetScroll);
    				}

    				$$invalidate(19, oldScrollTarget = scrollTarget);
    			}
    		}
    	};

    	return [
    		collapsed,
    		use,
    		className,
    		style,
    		variant,
    		color,
    		prominent,
    		dense,
    		scrollTarget,
    		instance,
    		element,
    		internalClasses,
    		internalStyles,
    		forwardEvents,
    		handleTargetScroll,
    		$$restProps,
    		getPropStore,
    		getElement,
    		propStoreSet,
    		oldScrollTarget,
    		oldVariant,
    		$$scope,
    		slots,
    		resize_handler,
    		scroll_handler,
    		header_binding,
    		SMUITopAppBarIconButton_nav_handler
    	];
    }

    class TopAppBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance_1,
    			create_fragment$3,
    			safe_not_equal,
    			{
    				use: 1,
    				class: 2,
    				style: 3,
    				variant: 4,
    				color: 5,
    				collapsed: 0,
    				prominent: 6,
    				dense: 7,
    				scrollTarget: 8,
    				getPropStore: 16,
    				getElement: 17
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopAppBar",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get use() {
    		throw new Error("<TopAppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<TopAppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<TopAppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<TopAppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<TopAppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<TopAppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get variant() {
    		throw new Error("<TopAppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variant(value) {
    		throw new Error("<TopAppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<TopAppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<TopAppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get collapsed() {
    		throw new Error("<TopAppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set collapsed(value) {
    		throw new Error("<TopAppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prominent() {
    		throw new Error("<TopAppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prominent(value) {
    		throw new Error("<TopAppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dense() {
    		throw new Error("<TopAppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dense(value) {
    		throw new Error("<TopAppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollTarget() {
    		throw new Error("<TopAppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollTarget(value) {
    		throw new Error("<TopAppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getPropStore() {
    		return this.$$.ctx[16];
    	}

    	set getPropStore(value) {
    		throw new Error("<TopAppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[17];
    	}

    	set getElement(value) {
    		throw new Error("<TopAppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Row = classAdderBuilder({
        class: 'mdc-top-app-bar__row',
        component: Div,
    });

    /* node_modules/@smui/top-app-bar/dist/Section.svelte generated by Svelte v3.46.4 */
    const file$1 = "node_modules/@smui/top-app-bar/dist/Section.svelte";

    function create_fragment$2(ctx) {
    	let section;
    	let section_class_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let section_levels = [
    		{
    			class: section_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-top-app-bar__section': true,
    				'mdc-top-app-bar__section--align-start': /*align*/ ctx[2] === 'start',
    				'mdc-top-app-bar__section--align-end': /*align*/ ctx[2] === 'end'
    			})
    		},
    		/*toolbar*/ ctx[3] ? { role: 'toolbar' } : {},
    		/*$$restProps*/ ctx[6]
    	];

    	let section_data = {};

    	for (let i = 0; i < section_levels.length; i += 1) {
    		section_data = assign(section_data, section_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			if (default_slot) default_slot.c();
    			set_attributes(section, section_data);
    			add_location(section, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);

    			if (default_slot) {
    				default_slot.m(section, null);
    			}

    			/*section_binding*/ ctx[10](section);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, section, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[5].call(null, section))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(section, section_data = get_spread_update(section_levels, [
    				(!current || dirty & /*className, align*/ 6 && section_class_value !== (section_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-top-app-bar__section': true,
    					'mdc-top-app-bar__section--align-start': /*align*/ ctx[2] === 'start',
    					'mdc-top-app-bar__section--align-end': /*align*/ ctx[2] === 'end'
    				}))) && { class: section_class_value },
    				dirty & /*toolbar*/ 8 && (/*toolbar*/ ctx[3] ? { role: 'toolbar' } : {}),
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (default_slot) default_slot.d(detaching);
    			/*section_binding*/ ctx[10](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","align","toolbar","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Section', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { align = 'start' } = $$props;
    	let { toolbar = false } = $$props;
    	let element;

    	setContext('SMUI:icon-button:context', toolbar
    	? 'top-app-bar:action'
    	: 'top-app-bar:navigation');

    	setContext('SMUI:button:context', toolbar
    	? 'top-app-bar:action'
    	: 'top-app-bar:navigation');

    	function getElement() {
    		return element;
    	}

    	function section_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(4, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('align' in $$new_props) $$invalidate(2, align = $$new_props.align);
    		if ('toolbar' in $$new_props) $$invalidate(3, toolbar = $$new_props.toolbar);
    		if ('$$scope' in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		forwardEvents,
    		use,
    		className,
    		align,
    		toolbar,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('align' in $$props) $$invalidate(2, align = $$new_props.align);
    		if ('toolbar' in $$props) $$invalidate(3, toolbar = $$new_props.toolbar);
    		if ('element' in $$props) $$invalidate(4, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		align,
    		toolbar,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		section_binding
    	];
    }

    class Section$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			use: 0,
    			class: 1,
    			align: 2,
    			toolbar: 3,
    			getElement: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Section",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get use() {
    		throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toolbar() {
    		throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toolbar(value) {
    		throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[7];
    	}

    	set getElement(value) {
    		throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    classAdderBuilder({
        class: 'mdc-top-app-bar__title',
        component: Span,
    });

    const Section = Section$1;

    /* src/components/header/Header.svelte generated by Svelte v3.46.4 */

    // (8:6) <IconButton class="material-icons" aria-label="Home" href="#/">
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(8:6) <IconButton class=\\\"material-icons\\\" aria-label=\\\"Home\\\" href=\\\"#/\\\">",
    		ctx
    	});

    	return block;
    }

    // (9:6) <IconButton class="material-icons" aria-label="Settings" href="#/settings"         >
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("settings");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(9:6) <IconButton class=\\\"material-icons\\\" aria-label=\\\"Settings\\\" href=\\\"#/settings\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (7:4) <Section align="end" toolbar>
    function create_default_slot_2(ctx) {
    	let iconbutton0;
    	let t;
    	let iconbutton1;
    	let current;

    	iconbutton0 = new IconButton({
    			props: {
    				class: "material-icons",
    				"aria-label": "Home",
    				href: "#/",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	iconbutton1 = new IconButton({
    			props: {
    				class: "material-icons",
    				"aria-label": "Settings",
    				href: "#/settings",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(iconbutton0.$$.fragment);
    			t = space();
    			create_component(iconbutton1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbutton0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(iconbutton1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const iconbutton0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				iconbutton0_changes.$$scope = { dirty, ctx };
    			}

    			iconbutton0.$set(iconbutton0_changes);
    			const iconbutton1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				iconbutton1_changes.$$scope = { dirty, ctx };
    			}

    			iconbutton1.$set(iconbutton1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbutton0.$$.fragment, local);
    			transition_in(iconbutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbutton0.$$.fragment, local);
    			transition_out(iconbutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbutton0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(iconbutton1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(7:4) <Section align=\\\"end\\\" toolbar>",
    		ctx
    	});

    	return block;
    }

    // (6:2) <Row>
    function create_default_slot_1(ctx) {
    	let section;
    	let current;

    	section = new Section({
    			props: {
    				align: "end",
    				toolbar: true,
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(section.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(section, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const section_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				section_changes.$$scope = { dirty, ctx };
    			}

    			section.$set(section_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(section, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(6:2) <Row>",
    		ctx
    	});

    	return block;
    }

    // (5:0) <TopAppBar variant="static" color="primary">
    function create_default_slot(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(5:0) <TopAppBar variant=\\\"static\\\" color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let topappbar;
    	let current;

    	topappbar = new TopAppBar({
    			props: {
    				variant: "static",
    				color: "primary",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(topappbar.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(topappbar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const topappbar_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				topappbar_changes.$$scope = { dirty, ctx };
    			}

    			topappbar.$set(topappbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topappbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topappbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(topappbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ TopAppBar, Row, Section, IconButton });
    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.4 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let body;
    	let header;
    	let t;
    	let router;
    	let current;
    	header = new Header({ $$inline: true });
    	router = new Router({ props: { routes }, $$inline: true });

    	const block = {
    		c: function create() {
    			body = element("body");
    			create_component(header.$$.fragment);
    			t = space();
    			create_component(router.$$.fragment);
    			attr_dev(body, "class", "svelte-6xe313");
    			add_location(body, file, 6, 0, 181);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			mount_component(header, body, null);
    			append_dev(body, t);
    			mount_component(router, body, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    			destroy_component(header);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { name } = $$props;
    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ Router, routes, Header, name });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map