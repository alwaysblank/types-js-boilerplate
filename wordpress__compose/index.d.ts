/**
 * Definitions for the `@wordpress/compose` package.
 *
 * @link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-compose/
 * @link https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/wordpress__compose/index.d.ts
 */
declare module '@wordpress/compose' {
	import {ComponentType} from '@lipemat/js-boilerplate/helpers';
	import {Ref} from 'react';


	type DebounceOptions = {
		leading: boolean;
		maxWait: number;
		trailing: boolean;
	}

	/**
	 * @link https://github.com/WordPress/gutenberg/blob/trunk/packages/compose/src/utils/debounce/index.ts
	 */
	interface DebouncedFunc<T extends ( ...args: any[] ) => any> {
		( ...args: Parameters<T> ): ReturnType<T> | undefined;
		/**
		 * Throw away any pending invocation of the debounced function.
		 */
		cancel(): void;
		/**
		 * If there is a pending invocation of the debounced function, invoke it immediately and return its return value.
		 *
		 * Otherwise, return the value from the last invocation, or undefined if the debounced function was never invoked.
		 */
		flush(): ReturnType<T> | undefined;
	}


	// @note displayName is assigned directly to component, not a prop.
	export interface createHigherOrderComponentProps {
		displayName?: string;
	}


	/**
	 * Given a function mapping a component to an enhanced component and modifier
	 * name, returns the enhanced component augmented with a generated displayName.
	 *
	 * @link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-compose/#createhigherordercomponent
	 */
	type createHigherOrderComponent = <T extends ComponentType<any>,
		R extends ComponentType<any>>( mapCallback: ( WrappedComponent: T) => R, modifierName: string ) => ( Inner: T ) => R & createHigherOrderComponentProps;

	/**
	 * Copy text to clipboard.
	 *
	 * @link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-compose/#usecopytoclipboard
	 */
	type useCopyToClipboard = <T = HTMLButtonElement>( text: string | (() => string), onSuccess: () => void ) => Ref<T>;

	/**
	 * Debounce a function like Lodash `debounce`. A new debounced function will
	 * be returned and any scheduled calls cancelled if any of the arguments change,
	 * including the function to debounce, so please wrap functions created on
	 * render in components in `useCallback`.
	 *
	 * @link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-compose/#usedebounce
	 */
	type useDebounce = <T extends (...args: any[]) => any>( func: T, wait: number, options?: DebounceOptions ) => DebouncedFunc<T>;

	export interface withInstanceIdProps {
		instanceId?: string;
	}

	type withInstanceId = <P>( WrappedComponent: ComponentType<P> ) => ComponentType<P & withInstanceIdProps> & createHigherOrderComponentProps;


	export const createHigherOrderComponent: createHigherOrderComponent;
	export const useCopyToClipboard: useCopyToClipboard;
	export const useDebounce: useDebounce;
	export const withInstanceId: withInstanceId;

	export default interface Compose {
		createHigherOrderComponent: createHigherOrderComponent;
		useCopyToClipboard: useCopyToClipboard;
		useDebounce: useDebounce;
		withInstanceId: withInstanceId;
	}
}
