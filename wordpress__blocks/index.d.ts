
/**
 * Definitions for the `@wordpress/blocks` package.
 *
 * @link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/
 * @link https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/wordpress__blocks/index.d.ts
 */
declare module '@wordpress/blocks' {
	import {BlockClientId, CoreBlocks, CoreBlocksDispatch} from '@wordpress/data';
	import {ReactElement, SVGProps} from 'react';
	import {iconType} from '@wordpress/components';

	type dataTypes =
		'null'
		| 'boolean'
		| 'object'
		| 'array'
		| 'number'
		| 'string'
		| 'integer';

	export type WPBlockVariationScope = 'block' | 'inserter' | 'transform';

	/**
	 * Pass to `Transform` when transforming a legacy widget
	 * to a block.
	 *
	 * @link https://developer.wordpress.org/block-editor/how-to-guides/widgets/legacy-widget-block/#2-add-a-block-transform
	 */
	export type LegacyWidget<Attr> = {
		idBase: string;
		instance: {
			encoded: string;
			hash: string;
			raw: Attr;
		};
		__internalWidgetId?: string;
	}


	/**
	 * @link https://developer.wordpress.org/block-editor/reference-guides/block-api/block-attributes/
	 */
	type AttributeShape = {
		type: dataTypes | dataTypes[];
		source?: 'text' | 'html' | 'query' | 'attribute';
		/**
		 * Default values won't be sent during render, so they must be either
		 * registered via `register_block_type` with PHP or the template must
		 * fall back to known defaults if no value is sent.
		 */
		default?: any;
		enum?: Array<string | boolean | number>;
		// jQuery selector of element to extract value from.
		selector?: string;
		// Tag to wrap each line when using "HTML" source and RichText with multiline prop.
		multiline?: string;
		// html attribute of selector element if using "attribute" source
		attribute?: string;
		// Extract array of values from the markup using "selector" and attributes of HTML tags.
		query?: {
			[ key: string ]: {
				type: 'null' | 'boolean' | 'object' | 'array' | 'number' | 'string' | 'integer';
				source: 'text' | 'html' | 'query' | 'attribute' | 'meta';
				attribute: string;
			}
		}
		// When using array types, this defines subtypes.
		items?: {
			type: dataTypes
		}
		// When using object types, this defines subtypes.
		properties?: {
			[ key: string ]: {
				type: dataTypes
			}
		}
	};

	/**
	 * Shape and retrieval type for block data.
	 *
	 * @link https://developer.wordpress.org/block-editor/reference-guides/block-api/block-attributes/
	 */
	export type BlockAttributes<Attr> = {
		[key in keyof Attr]: AttributeShape | Omit<AttributeShape, 'source'> &
		{
			// Special meta type with `meta` requirement.
			source: 'meta';
			// Meta key to store/retrieve data when using `source:'meta'`.
			meta: keyof Attr;
		}
	}

	/**
	 * Props passed to `edit` component of blocks.
	 * Not well documented and mostly tracked down via source code.
	 *
	 * @link https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/
	 */
	export type BlockEditProps<Attr, Context = {}> = {
		attributes: Attr
		className: string;
		clientId: string;
		context: {
			[reference in keyof Context]: Context[reference];
		}
		insertBlocksAfter: ( blocks: CreateBlock[] ) => void;
		isSelected: boolean
		isSelectionEnabled: boolean;
		mergeBlocks: ( forward: boolean ) => void;
		name: string;
		onRemove: () => void;
		onReplace: (
			blocks: CreateBlock | CreateBlock[],
			index: number,
			initialPosition: 0 | -1 | null,
		) => void;
		toggleSelection: ( enabled: boolean ) => void;
		setAttributes: ( newValue: {
			[attribute in keyof Attr]?: Attr[attribute]
		} ) => void;

	}

	/**
	 * Block Variation shape.
	 *
	 * @link https://developer.wordpress.org/block-editor/reference-guides/block-api/block-variations/
	 */
	export type BlockVariation<Attr = object, V extends string = string> = {
		name: V;
		title: string;
		description?: string;
		category?: string;
		icon?: BlockIcon;
		isDefault?: boolean;
		attributes?: BlockAttributes<Attr>;
		innerBlocks?: ChildBlocks;
		example?: BlockExample<Partial<Attr>>;
		scope?: Array<WPBlockVariationScope>;
		keywords?: string[];
		isActive?: ( ( attr: BlockAttributes<Attr>, variation: BlockAttributes<Attr> ) => boolean ) | Array<keyof Attr>;
	}

	/**
	 * Placeholder data for block previews/examples.
	 *
	 * @link https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/#example-optional
	 */
	export type BlockExample<Attr = Object> = {
		attributes?: Attr;
		viewportWidth?: number;
		innerBlocks?: Array<{
			name: string;
			attributes?: Object;
			innerBlocks?: BlockExample['innerBlocks']
		}>;
	};

	/**
	 * The shape of a block mapped to an id when stored
	 * in redux state.
	 *
	 * @link https://developer.wordpress.org/block-editor/developers/block-api/block-registration/
	 */
	export type CreateBlock<Attr = { [ key: string ]: any }, I = []> = {
		attributes: Attr;
		clientId: string;
		innerBlocks: I | Array<CreateBlock>;
		isValid: boolean;
		name: string;
		originalContent?: string;
	}

	export type StyleVariation = {
		name: string;
		label: string;
		isDefault?: boolean;
	};

	/**
	 * Block transformations configuration.
	 *
	 * @since 1.7.0
	 *
	 * @link https://developer.wordpress.org/block-editor/reference-guides/block-api/block-transforms/
	 */
	export type Transforms<T, Attr> = {
		type: 'block';
		blocks: Array<string | '*'>;
		transform: ( attributes: T, innerBlocks: Array<CreateBlock<T>> ) => CreateBlock<Attr>;
		isMatch?: ( attributes: T, block: CreateBlock<T> ) => boolean;
		isMultiBlock?: false;
		priority?: number;
	} | {
		type: 'block';
		blocks: Array<string | '*'>;
		transform: ( attributes: T[], innerBlocks: Array<CreateBlock<T>>[] ) => CreateBlock<Attr>;
		isMatch?: ( attributes: T[], blocks: Array<CreateBlock<Attr>> ) => boolean;
		isMultiBlock: true;
		priority?: number;
	}

	/**
	 * Transforms only available for `to`.
	 *
	 * @link https://developer.wordpress.org/block-editor/reference-guides/block-api/block-transforms/
	 */
	export type TransformsTo<T, Attr> = {
		type: 'block';
		blocks: Array<string | '*'>;
		transform: ( attributes: Attr, innerBlocks: Array<CreateBlock> ) => CreateBlock<T>;
		isMatch?: ( attributes: Attr, block: CreateBlock<Attr> ) => boolean;
		isMultiBlock?: false;
		priority?: number;
	} | {
		type: 'block';
		blocks: Array<string | '*'>;
		transform: ( attributes: Attr, innerBlocks: Array<CreateBlock>[] ) => Array<CreateBlock<T>>;
		isMatch?: ( attributes: Attr, blocks: Array<CreateBlock<Attr>> ) => boolean;
		isMultiBlock: true;
		priority?: number;
	}

	/**
	 * Transforms only available for `from`.
	 *
	 * @link https://developer.wordpress.org/block-editor/reference-guides/block-api/block-transforms/
	 */
	export type TransformsFrom<Attr> = {
		type: 'enter';
		regExp: RegExp;
		transform: ( value: string ) => Array<CreateBlock<Attr>> | CreateBlock<Attr>;
		priority?: number;
	} | {
		type: 'files';
		transform: ( files: Array<string> ) => Array<CreateBlock<Attr>> | CreateBlock<Attr>;
		isMatch?: ( files: Array<string> ) => boolean;
		priority?: number;
	} | {
		type: 'prefix';
		transform: ( content: string ) => Array<CreateBlock<Attr>> | CreateBlock<Attr>;
		priority?: number;
	} | {
		type: 'raw';
		transform: ( node: Node ) => Array<CreateBlock<Attr>> | CreateBlock<Attr>;
		isMatch?: ( node: Node ) => boolean;
		schema?: Object | ( () => Object );
		selector?: string;
		priority?: number;
	} | {
		type: 'shortcode';
		tag: string | Array<string>;
		attributes: {
			[key in keyof Attr]: AttributeShape &
			{
				shortcode?: ( attr: Partial<Attr> ) => dataTypes;
			};
		};
		isMatch: ( attr: Partial<Attr> ) => boolean;
		priority?: number;
	}

	export type ChildBlocks<T = any> = Array<[ string, { [ key: string ]: any }?, ( ChildBlocks | CreateBlock<T>[] )? ]>;


	/**
	 * @link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/#getdefaultblockname
	 * @link https://github.dev/WordPress/gutenberg/tree/trunk/packages/blocks/src/api
	 */
	export const getDefaultBlockName: CoreBlocks['getDefaultBlockName'];

	/**
	 * @link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/#getblocktype
	 * @link https://github.dev/WordPress/gutenberg/tree/trunk/packages/blocks/src/api
	 */
	export const getBlockType: CoreBlocks['getBlockType'];

	/**
	 * @link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/#getblocktypes
	 * @link https://github.dev/WordPress/gutenberg/tree/trunk/packages/blocks/src/api
	 */
	export const getBlockTypes: CoreBlocks['getBlockTypes'];

	/**
	 * @link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/#getblocksupport
	 * @link https://github.dev/WordPress/gutenberg/tree/trunk/packages/blocks/src/api
	 */
	export const getBlockSupport: CoreBlocks['getBlockSupport'];

	/**
	 * @link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/#hasblocksupport
	 * @link https://github.dev/WordPress/gutenberg/tree/trunk/packages/blocks/src/api
	 */
	export const hasBlockSupport: CoreBlocks['hasBlockSupport'];

	/**
	 * @link https://github.dev/WordPress/gutenberg/tree/trunk/packages/blocks/src/api
	 */
	export const getBlockVariations: CoreBlocks['getBlockVariations'];

	/**
	 * @link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/#getchildblocknames
	 * @link https://github.dev/WordPress/gutenberg/tree/trunk/packages/blocks/src/api
	 */
	export const getChildBlockNames: CoreBlocks['getChildBlockNames'];

	/**
	 * @link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/#haschildblocks
	 * @link https://github.dev/WordPress/gutenberg/tree/trunk/packages/blocks/src/api
	 */
	export const hasChildBlocks: CoreBlocks['hasChildBlocks'];

	/**
	 * @link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/#haschildblockswithinsertersupport
	 * @link https://github.dev/WordPress/gutenberg/tree/trunk/packages/blocks/src/api
	 */
	export const hasChildBlocksWithInserterSupport: CoreBlocks['hasChildBlocksWithInserterSupport'];

	/**
	 * @link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/#getgroupingblockname
	 * @link https://github.dev/WordPress/gutenberg/tree/trunk/packages/blocks/src/api
	 */
	export const getGroupingBlockName: CoreBlocks['getGroupingBlockName'];


	export function getCategories<Category extends string = ''>(): Array<{
		icon: BlockIcon | null;
		slug: BlockCategory<Category>;
		title: string;
	}>

	export type IconObject = {
		// Specifying a background color to appear with the icon e.g.,: in the inserter.
		background?: string;
		// Specifying a color for the icon
		foreground?: string;
		// Specifying a dashicon or Svg.
		src: iconType | SVGProps<SVGSVGElement>;
	}

	export type BlockCategory<Category> =
		'text'
		| 'media'
		| 'design'
		| 'widgets'
		| 'embed'
		| 'reusable'
		| Category

	/**
	 * All possible icon types when registering a block.
	 */
	export type BlockIcon = iconType | IconObject | SVGProps<SVGSVGElement>;

	/**
	 * Custom CSS classnames for generated markup.
	 *
	 * @link https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-selectors.md
	 */
	export type BlockSelectors = {
		// The primary CSS class to apply to the block. Replaces the `.wp-block-name` class if set.
		root: string;
		border?: string | {
			root?: string,
			color?: string,
			radius?: string,
			style?: string,
			width?: string
		};
		color?: string | {
			root?: string;
			text?: string;
			background?: string;
		};
		dimensions?: string | {
			root?: string;
			minHeight?: string;
		};
		spacing?: string | {
			root?: string;
			margin?: string;
			padding?: string;
			blockGap?: string;
		};
		typography?: string | {
			root?: string;
			fontFamily?: string;
			fontSize?: string;
			fontStyle?: string;
			fontWeight?: string;
			letterSpacing?: string;
			lineHeight?: string;
			textDecoration?: string;
			textTransform?: string;
		};
	}


	/**
	 * Parser utility for converting HTML block JSON to finished block objects.
	 *
	 * Pass post content with serialized blocks and receive block objects back.
	 *
	 * @link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/#parse
	 *
	 */
	export function parse( content: string ): CreateBlock[];

	/**
	 * Block registration settings.
	 *
	 * @link https://developer.wordpress.org/block-editor/developers/block-api/block-registration/
	 * @link https://schemas.wp.org/trunk/block.json
	 */
	export type BlockSettings<Attr, Category = '', Transform = Attr, Context = {}> = {
		title: string;
		description?: string;
		category: BlockCategory<Category>;
		// Svg | dashicon | configuration
		icon: BlockIcon;
		keywords?: string[];
		styles?: Array<StyleVariation>;
		/**
		 * Only optional if registered on PHP side via `register_block_type_from_metadata`
		 *
		 * @link https://github.com/WordPress/gutenberg/blob/master/docs/designers-developers/developers/block-api/block-metadata.md
		 */
		attributes?: BlockAttributes<Attr>;
		example?: BlockExample<Partial<Attr>>;
		variations?: Array<BlockVariation<Attr>>;
		/**
		 * Offer block transformations.
		 *
		 * @link https://developer.wordpress.org/block-editor/reference-guides/block-api/block-transforms/
		 */
		transforms?: {
			from?: Array<Transforms<Transform, Attr> | TransformsFrom<Attr>>;
			to?: Array<TransformsTo<Transform, Attr>>;
			ungroup?: ( attr: Attr, innerBlocks: Array<CreateBlock<Attr>> ) => Array<CreateBlock<Attr>>;
		};
		/**
		 * Use context to pass attribute values to inner blocks.
		 *
		 * @link https://developer.wordpress.org/block-editor/reference-guides/block-api/block-context/
		 */
		providesContext?: {
			[reference in keyof Context]: keyof Attr;
		},
		usesContext?: Array<keyof Context>;
		// Allow this block to only be used as a child or grandchild of specified blocks.
		ancestor?: string[];
		// Allow this block to only be used as a direct child of specified blocks.
		parent?: string[];
		/**
		 * Features this block supports.
		 *
		 * @link https://developer.wordpress.org/block-editor/developers/block-api/block-supports/
		 */
		supports?: {
			align?: boolean | Array<'left' | 'right' | 'full' | 'wide'>;
			// Remove the support for wide alignment.
			alignWide?: boolean;
			// Anchors let you link directly to a specific block on a page. This property adds a field to define an id for the block, and a button to copy the direct link.
			anchor?: boolean;
			// False removes the support for the custom className.
			customClassName?: boolean;
			// False removes the support for the generated className.
			className?: boolean;
			/**
			 * Support color selections.
			 *
			 * @link https://developer.wordpress.org/block-editor/developers/block-api/block-supports/#color
			 */
			color?: {
				background?: boolean; // Enable background color UI control.
				gradients?: boolean; // Enable gradient color UI control.
				text?: boolean; // Enable text color UI control.
				link?: boolean; // Enable link color UI control.
			};
			/**
			 * Enable dimensions UI control.
			 *
			 * @link https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/#dimensions
			 */
			dimensions?: {
				minHeight?: true // Enable min height control.
			};
			/**
			 * Enable font size UI control.
			 *
			 * @link https://developer.wordpress.org/block-editor/developers/block-api/block-supports/#fontsize
			 */
			fontSize?: boolean;
			/**
			 * Enable line height UI control.
			 *
			 * @link https://developer.wordpress.org/block-editor/developers/block-api/block-supports/#lineheight
			 */
			lineHeight?: boolean;
			// False removes support for an HTML mode.
			html?: boolean;
			// False hides this block from the inserter.
			inserter?: boolean;
			// False hides the lock options from block options dropdown.
			lock?: boolean;
			// False allows the block just once per post
			multiple?: boolean;
			// False prevents the block to be converted into a reusable block.
			reusable?: boolean;
			// Custom CSS classnames for generated markup.
			selectors?: BlockSelectors;
			/**
			 * Enable CSS spacing UI controls
			 *
			 * @link https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/#spacing
			 */
			spacing?: {
				blockGap?: boolean | Array<'horizontal' | 'vertical'>;
				margin?: boolean | Array<'top' | 'bottom' | 'left' | 'right'>;
				padding?: boolean | Array<'top' | 'bottom' | 'left' | 'right'>;
			}
			/**
			 * Enable typography controls and attributes.
			 *
			 * @link https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/#typography
			 */
			typography?: {
				fontSize: boolean;
				lineHeight: boolean;
			}
		}
		/**
		 * Display content in the editor and make and changes to data.
		 *
		 * https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
		 */
		edit: ( params: BlockEditProps<Attr, Context> ) => ReactElement;
		/**
		 * Save the finished black markup to be rendered on the site.
		 * Return null to handle rendering on the PHP side.
		 *
		 * @link https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
		 */
		save: <C extends Array<any> = ChildBlocks>( params: {
			attributes: Attr,
			innerBlocks: C
		} ) => ReactElement | null;
		// Version 2 https://make.wordpress.org/core/2020/11/18/block-api-version-2/
		// Version 3 https://github.com/WordPress/gutenberg/pull/48286
		apiVersion?: 1 | 2 | 3;
	};


	export type WPBlockSerializationOptions = {
		isInnerBlocks: boolean;
	}

	/**
	 * Create a block object from a block's configuration.
	 *
	 * @link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/#createblock
	 */
	export function createBlock<Attr>( id: string, attributes?: Attr, InnerBlocks?: Array<ChildBlocks | CreateBlock> ): CreateBlock<Attr>;

	/**
	 * Convert block configurations into Block objects
	 *
	 * @link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/#createblocksfrominnerblockstemplate
	 */
	export function createBlocksFromInnerBlocksTemplate( blocks: ChildBlocks | CreateBlock[] ): CreateBlock[];

	/**
	 * @link https://developer.wordpress.org/block-editor/developers/block-api/block-registration/
	 */
	export function registerBlockType<Attr, C = ''>( id: string, settings: BlockSettings<Attr, C> ): void;

	/**
	 * Register a collection to allow organizing blocks into a section based on a plugin/theme/whatever.
	 *
	 * @link https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#block-collections
	 *
	 * @param namespace - Any blocks matching this namespace will automatically be included
	 *                    within this collection. e.g., "lipe"
	 * @param {Object} settings
	 */
	export function registerBlockCollection( namespace: string, settings: {
		title: string;
		icon?: BlockIcon;
	} ): void;

	/**
	 * Registers a new block style variation for the given block.
	 *
	 * @link https://developer.wordpress.org/block-editor/developers/filters/block-filters/#block-style-variations
	 *
	 * @param {string} blockName      Name of block (example: “core/latest-posts”).
	 * @param {Object} styleVariation
	 */
	export function registerBlockStyle( blockName: string, styleVariation: StyleVariation ): void;

	/**
	 * Unregisters a block style variation for the given block.
	 *
	 * @link https://developer.wordpress.org/block-editor/developers/filters/block-filters/#block-style-variations
	 *
	 * @param {string} blockName - Name of block (example: “core/latest-posts”).
	 * @param {string} styleVariationName - Name of CSS class applied to the block.
	 */
	export function unregisterBlockStyle( blockName: string, styleVariationName: string ): void;

	/**
	 * Unregister a block from the editor.
	 *
	 * @link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/#unregisterBlockType
	 */
	export function unregisterBlockType( blockName: string ): BlockSettings<object> | undefined;

	/**
	 * Registers a new block variation for an existing block type.
	 *
	 * @link https://developer.wordpress.org/block-editor/reference-guides/block-api/block-variations/
	 *
	 * @param blockName - Name of the block (example: “core/columns”).
	 * @param variation - Object describing a block variation.
	 */
	export function registerBlockVariation<Attr>( blockName: string, variation: BlockVariation<Attr> ): void;

	/**
	 * @link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/#setdefaultblockname
	 * @link https://github.dev/WordPress/gutenberg/tree/trunk/packages/blocks/src/api
	 */
	export const setDefaultBlockName: CoreBlocksDispatch['setDefaultBlockName'];

	/**
	 * @link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/#setgroupingblockname
	 * @link https://github.dev/WordPress/gutenberg/tree/trunk/packages/blocks/src/api
	 */
	export const setGroupingBlockName: CoreBlocksDispatch['setGroupingBlockName'];

	/**
	 * @link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/#serialize
	 */
	export function serialize( blocks: Array<BlockClientId>, options?: WPBlockSerializationOptions ): string;

	/**
	 * Unregisters a block variation defined for an existing block type.
	 *
	 * @param blockName - Name of the block (example: “core/columns”).
	 * @param variationName - Name of the variation defined for the block.
	 */
	export function unregisterBlockVariation( blockName: string, variationName: string ): void;

	export default interface Blocks {
		createBlock: typeof createBlock;
		createBlocksFromInnerBlocksTemplate: typeof createBlocksFromInnerBlocksTemplate;
		getBlockSupport: typeof getBlockSupport;
		getBlockType: typeof getBlockType;
		getBlockTypes: typeof getBlockTypes;
		getBlockVariations: typeof getBlockVariations;
		getCategories: typeof getCategories;
		getChildBlockNames: typeof getChildBlockNames;
		getDefaultBlockName: typeof getDefaultBlockName;
		getGroupingBlockName: typeof getGroupingBlockName;
		hasBlockSupport: typeof hasBlockSupport;
		hasChildBlocks: typeof hasChildBlocks;
		hasChildBlocksWithInserterSupport: typeof hasChildBlocksWithInserterSupport;
		parse: typeof parse;
		registerBlockCollection: typeof registerBlockCollection;
		registerBlockStyle: typeof registerBlockStyle;
		registerBlockType: typeof registerBlockType;
		registerBlockVariation: typeof registerBlockVariation;
		serialize: typeof serialize;
		setDefaultBlockName: typeof setDefaultBlockName;
		setGroupingBlockName: typeof setGroupingBlockName;
		unregisterBlockStyle: typeof unregisterBlockStyle;
		unregisterBlockType: typeof unregisterBlockType;
		unregisterBlockVariation: typeof unregisterBlockVariation;
	}
}
