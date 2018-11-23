/**
 * BLOCK: document
 *
 * Registering a basic block with Gutenberg.
 */

import EadHelper from './modules/helper';
import EadInspector from './modules/inspector';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { ServerSideRender, IconButton } = wp.components;
/**
 * Register: a Gutenberg Block.
 *
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'embed-any-document/document', {
	title: __( 'Document' ), // Block title.
	description: __( 'Upload and Embed your documents.' ), // Block description
	icon: 'media-document', // Block icon
	category: 'embed', // Block category,
	keywords: [ __( 'add document' ), __( 'embed document' ), __( 'embed any document' ) ], // Access the block easily with keyword aliases
	/**
	 * The edit function describes the structure of the block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 */
	edit: ( props ) => {
		const { attributes, setAttributes } = props;
		const { shortcode } = attributes;
		let blockProps = null;
		const setBlockProps = () => {
			blockProps = props;
			blockProps.activeEadBlock = true;
		};
		jQuery('body').on('click', '#embed-popup #insert-doc', () => {
			let shortcodeText = jQuery('#embed-popup #shortcode').text();
			let { url, width = emebeder.width, height = emebeder.height, download = emebeder.download, viewer = emebeder.provider, text = emebeder.text, cache = true } = EadHelper.parseShortcode(shortcodeText);
			if( blockProps !== null ) {
				if(blockProps.activeEadBlock === true) {
					blockProps.activeEadBlock = false;
					blockProps.setAttributes({
						shortcode: shortcodeText,
						url: url,
						width: width,
						height: height,
						download: download,
						text: text,
						viewer: viewer,
						cache: cache === 'off' ? false : true
					});
				}
			}
		});
		if( typeof shortcode !== 'undefined' ) {
			return [
				<EadInspector { ...{ setAttributes, ...props } } />,
				<ServerSideRender
					block="embed-any-document/document"
					attributes={ attributes }
				/>
			];
		} else {
			return (
				<div className="components-placeholder ead-block-wrapper">
					<IconButton className="awsm-embed" icon="media-document" onClick={ setBlockProps } isLarge>{ __( 'Add Document' ) }</IconButton>
				</div>
			);
		}
	},
	/**
	 * The save function defines the way in which the different attributes should be combined into the final markup, which is then serialized by Gutenberg into post_content.
	 */
	save: ( props ) => {
		const { attributes: { shortcode } } = props;
		return shortcode;
	},
} );