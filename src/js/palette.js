/*
 * gui-builder - A simple WYSIWYG HTML5 app creator
 * Copyright (c) 2011, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
"use strict";

/*
 * The palette.json properties are:
 *
 *   id:      String, internal reference this widget set
 *   name:    String, human readable name and/or description
 *   version: String, (XXX: Unused, possible future value?)
 *   widgets: Array of objects, each with the following properties:
 *
 *       name:   String, Human readable widget name (TODO: L10N?)
 *       type:   String, HTMLElement type to use with createElement()
 *       icon:   String, CSS class id for the icon representation
 *       helper: String, HTML to use for creating the drag helper
 *       code:   String, HTML to be created when inserting this widget
 *                       into the DOM
 */

function loadPalette(container) {
    var defaultContainer = '#palette-panel',
        myContainer = container, hdr, acc;

    if (!myContainer) {
        myContainer = $(defaultContainer);
    }

    if (!myContainer || !myContainer.get()) {
        return false;
    }

    console.log("Starting palette load...");
    myContainer.append('<p id="palette_header" class="ui-helper-reset ui-widget ui-widget-header">Palette</p>');
    myContainer.append('<div id="palette_accordion"></div>');

    hdr = $('#palette_header');
    acc = $('#palette_accordion');

    // Make use of the flex box model in CSS3 to allow the tabs
    // to grow/shrink with the window/container
    myContainer.addClass('vbox');
    hdr.addClass('flex0');
    acc.addClass('flex1');

    // FIXME: Eventually, all widgets should come from the BWidget
    //        global structure.  For now, we load them as their own
    //        subcategory in the palette
    $(acc).append('<h3>jQuery Mobile</h3><div><ul id="jqm-widgets"></ul></div>');
    $(acc).append('<h3>Tizen Framework</h3><div><ul id="Tizen-widgets"></ul></div>');
    var ul = $('#jqm-widgets');
    $.each(BWidget.getPaletteWidgetTypes(), function(n, id) {
        // Add new <li> element to hold this widget
        var li = $('<li id="BWidget-'+id+'"></li>').appendTo($(ul));
        $(li).button({
            label: BWidget.getDisplayLabel(id),
            icons: {primary: BWidget.getIcon(id)}
        });
        $(li).disableSelection();
        $(li).addClass('nrc-palette-widget');
        $(li).data("code", BWidget.getTemplate(id));
        $(li).data("adm-node", {type: id});

        // FIXME: This should probably be replaced by a more flexible
        //        concept of widget groups.
        if (BWidget.startsNewGroup(id)) {
            $(ul).append("<hr>");
        }

        if (BWidget.startsNewAccordion(id)) {
            ul = $('#Tizen-widgets');
        }

        $(ul).append($(li));
    });

    $(acc).accordion({
        fillSpace: true
    });

    // Must explicitly react to window resize events to be
    // able to grow/shrink if we're in a flex box layout
    $(window).resize( function () { $(acc).accordion("resize"); });
}
