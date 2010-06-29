/*
    Copyright (C) 2008-2010 End Point Corporation, http://www.endpoint.com/

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.
       
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of 
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see: http://www.gnu.org/licenses/ 
*/

YUI.add(
    "ic-manage-widget-function-detail",
    function(Y) {
        var ManageFunctionDetail;

        ManageFunctionDetail = function (config) {
            ManageFunctionDetail.superclass.constructor.apply(this, arguments);
            this.publish('manageFunctionDetail:tabsrendered', {
                broadcast:  2,   // global notification
                emitFacade: true // emit a facade so we get the event target
            });
        };

        ManageFunctionDetail.NAME = "ic_manage_function_detail";

        Y.extend(
            ManageFunctionDetail,
            Y.IC.ManageFunction,
            {
                /*
                 * For an Order, this is the structure: 
                 *  _______   _____   _______   ________   _____
                 * |Details| |Goods| |History| |Payments| |Notes|
                 *  |         |       |         |          |
                 *  v         |       |         |          |
                 * Log        |       |         |          |
                 *            v       |         |          |
                 *(treeview) Line+[Inv|ntory Map|, Line, Li|e, ...
                 *                    |         |          |
                 *                    v         |          |
                 *        (treeview) Revision, R|vision, Re|ision, ...
                 *                       |      |          |
                 *                       v      |          |
                 *         (treeview) Line+[Elem|nt+[Parcel|ap]], Line, Line, ...
                 *                              |          |
                 *                              v          |
                 *                  (treeview) Transaction+|Allocation], Transaction, Transaction, ...
                 *                                 |       |
                 *                                 v       |
                 *                   (treeview) Line, Line,|Line...
                 *                                         |
                 *                                         v
                 *                             (treeview) Note, Note, Note
                 */
                _dummy_data: {
                    object_name: "Order",
                    pk_settings: [
                        {
                            "value": 6,
                            "field": "id"
                        }
                    ],
                    tabs: [
                        {
                            order: 0,
                            label: '0 - Details',
                            src: '/manage/function/Orders_orderDetailView/0?_mode=config&_format=json&_pk_id=6'
                        },
                        {
                            order: 1,
                            label: '1 - Goods',
                            related: [
                                {
                                    order: 0,
                                    label: '2 - Line',
                                    src: '/manage/function/Variants_variantDetailView/0?_mode=config&_format=json&_pk_id=1',
                                    related: [
                                        {
                                            order: 0,
                                            label: '3 - Inventory Map',
                                            content: {
                                                Description: 10,
                                                Status: 'Pending Return',
                                                Location: '',
                                                Condition: 'New',
                                                'Send Revision Element #': 2,
                                                Status: 'Shipped',
                                                'Receive Revision Element #': 14,
                                                Status: 'Pending Return'
                                            },
                                            related: [
                                                {
                                                    order: 0,
                                                    label: '4 - Inventory Record',
                                                    src: '/manage/function/Inventories_recordDetailView/0?_mode=config&_format=json&_pk_id=13'
                                                }
                                            ]
                                        },
                                        {
                                            order: 1,
                                            label: '4 - Inventory Map',
                                            content: {
                                                Description: 22,
                                                Status: 'Dynamic Sold',
                                                Location: '',
                                                Condition: 'New',
                                                'Send Revision Element #': 15,
                                                Status: 'Dynamic Sold'
                                            },
                                            related: [
                                                {
                                                    order: 0,
                                                    label: '5 - Inventory Record',
                                                    src: '/manage/function/Inventories_recordDetailView/0?_mode=config&_format=json&_pk_id=26'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            order: 2,
                            object_name: "History",
                            label: '6 - History',
                            related: [
                                {
                                    order: 0,
                                    label: '7 - Revision',
                                    src: '/manage/function/Orders__Revisions_revisionDetailView/0?_mode=config&_format=json&_pk_id=2',
                                    related: [
                                        {
                                            order: 0,
                                            label: '8 - Line',
                                            src: '/manage/function/Orders__Revisions__Lines_lineDetailView/0?_mode=config&_format=json&_pk_id=2',
                                            related: [
                                                {
                                                    order: 0,
                                                    label: '9 - Element',
                                                    content: {
                                                        Description: 2,
                                                        Variant: 'Test Variant 1 (TEST01-SIL)',
                                                        Kind: 'Send',
                                                        Status: 'Shipped',
                                                        Price: 78.24,
                                                        'Declared VAT': 10.21,
                                                        Balance: 0.00,
                                                        'Pending Balance': 0.00
                                                    },
                                                    related: [
                                                        {
                                                            order: 0,
                                                            label: '10 - Parcel',
                                                            src: '/manage/function/Parcels_parcelDetailView/0?_mode=config&_format=json&_pk_id=6'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    order: 1,
                                    label: '11 - Revision',
                                    src: '/manage/function/Orders__Revisions_revisionDetailView/0?_mode=config&_format=json&_pk_id=8',
                                    related: [
                                        {
                                            order: 0,
                                            label: '12 - Line',
                                            src: '/manage/function/Orders__Revisions__Lines_lineDetailView/0?_mode=config&_format=json&_pk_id=14',
                                            related: [
                                                {
                                                    order: 0,
                                                    label: '13 - Element',
                                                    content: {
                                                        Description: 14,
                                                        Variant: 'Test Variant 1 (TEST01-SIL)',
                                                        Kind: 'Receive',
                                                        Status: 'Pending Return',
                                                        Price: -78.24,
                                                        'Declared VAT': -10.21,
                                                        Balance: -78.24,
                                                        'Pending Balance': -78.24,
                                                        Options: '[ Add Adjustment ]'
                                                    },
                                                    related: [
                                                        {
                                                            order: 0,
                                                            label: '14 - Parcel',
                                                            src: '/manage/function/Parcels_parcelDetailView/0?_mode=config&_format=json&_pk_id=18'
                                                        }
                                                    ]
                                                },
                                                {
                                                    order: 1,
                                                    label: '15 - Element',
                                                    content: {
                                                        Description: 15,
                                                        Variant: 'Test Variant 1 (TEST01-SIL)',
                                                        Kind: 'Send',
                                                        Status: 'Dynamic Sold',
                                                        Price: 78.24,
                                                        'Declared VAT': 11.65,
                                                        Balance: 78.24,
                                                        'Pending Balance': 78.24,
                                                        Options: '[ Add Adjustment ]'
                                                    },
                                                    related: [
                                                        {
                                                            order: 1,
                                                            label: '16 - Parcel',
                                                            src: '/manage/function/Parcels_parcelDetailView/0?_mode=config&_format=json&_pk_id=18'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            order: 3,
                            label: '17 - Payments',
                            related: [
                                {
                                    order: 0,
                                    label: '18 - Transaction',
                                    src: '/manage/function/Transactions_txnDetailView/0?_mode=config&_format=json&_pk_id=122',
                                    content: {
                                        Description: 5,
                                        '# of Requests': 1
                                    },
                                    related: [
                                        {
                                            order: 0,
                                            label: '19 - Line',
                                            src: '/manage/function/TransactionAllocations__Lines_talDetailView/0?_mode=config&_format=json&_pk_id=1'
                                        },
                                        {
                                            order: 1,
                                            label: '20 - Line',
                                            src: '/manage/function/TransactionAllocations__Lines_talDetailView/0?_mode=config&_format=json&_pk_id=2'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            order: 4,
                            label: '21 - Notes',
                            content: 'No notes recorded for this order yet.'
                        }
                    ]
                },

                _tabs: null,

                bindUI: function () {
                    this.on('visibleChange', Y.bind(this._onVisibleChange, this));
                },

                getHeaderText: function () {
                    if (this._meta_data) {
                        var pks = this._meta_data.pk_settings[0];
                        var value = pks.value;
                        var header = this._meta_data.object_name + ' Detail ' + value;
                        // Y.log('detail::getHeaderText - header: ' + header);
                        return header;
                    }
                    else {
                        // Y.log('detail::getHeaderText - header is null - no meta_data');
                        return null;
                    }
                },

                _buildUI: function () {
                    // Y.log('detail::_buildUI');

                    if (! this.get('visible') ) return;

                    // the meta_data is already available, so build the outer tabs from it
                    this._meta_data = this._dummy_data; // testing...
                    var prefix = this.get('prefix') + '_ot';
                    this._tabs = new Y.IC.ManageTabView(
                        {
                            prefix: prefix
                        }
                    );
                    Y.each(this._meta_data.tabs, Y.bind(function (v, i) {
                        // Y.log('_meta_data.tab: ' + i);
                        if (!Y.Lang.isValue(v.src)) v['src'] = null;
                        if (!Y.Lang.isValue(v.related)) v['related'] = null;
                        /*
                        Y.log('v -> src -> related -> content');
                        Y.log(v);
                        Y.log(v.src);
                        Y.log(v.related);
                        Y.log(content);
                        */
                        this._tabs.add({
                            label: v.label, 
                            content: 'Loading...',
                            index: v.order,
                            plugins: [{
                                fn: Y.IC.ManageTabPanel,
                                cfg: {
                                    label: v.label || null,
                                    uri: v.src || null,
                                    content: v.content || null,
                                    related: v.related || null
                                }
                            }] 
                        }, v.order);
                    }, this));
                    this._tabs.after('render', Y.bind(this._afterOuterTabsRender, this));
                    this._content_node.setContent('');
                    this._tabs.render(this._content_node);
                    this.fire('manageFunction:loaded');
                },

                /*  Needs refactoring!
                 *  Even though this seems more appropriately a method
                 *  of tabview (or the tabpanel), it's here because
                 *  really there's no reason for it to be tied to tabs
                 *  at all.  If we have detail views without tabs, we
                 *  may want to add these nesting css classes there as
                 *  well.
                 */
                _afterOuterTabsRender: function (e) {
                    // Y.log('detail::_afterOuterTabsRender');
                    // run through each tabpanel
                    Y.each(this._tabs._tab_refs, function (v) {
                        // each ul should have a treeview plugin, 
                        //  so i could move this logic into ManageTreeview..
                        var uls = v.tab.get('panelNode').all('ul');
                        // first add nesting classes
                        if (uls.size() > 0) {
                            Y.each(uls, function (v1, i1) {
                                var lis = v1.get('children');
                                // add level0, level1, level2, level0 ...
                                lis.addClass('level' + (i1 % 3));
                            }, this);
                        }
                        // then add a toplevel menu
                        if (uls.size() > 1) {
                            var ul = Y.one(uls._nodes[0]);
                            var parent = ul.get('parentNode');
                            var lis = ul.get('children');
                            // if there's only one li in the top ul,
                            //  just add the 'menu' action to it                            
                            if (lis.size() === 1) {
                                var span = Y.one(lis._nodes[0]).one('span.first');
                                span.removeClass('first');
                                span.insert(
                                    Y.IC.ManageTreeview.SHOW_MENU_TEMPLATE +
                                        ' |&nbsp;', span
                                );
                                var menu_toggle = parent.one('span.treeview-menu-toggle');
                                menu_toggle.addClass('first');
                                menu_toggle.on(
                                    'click', 
                                    ul.treeviewLite._showMenu, 
                                    ul.treeviewLite
                                );
                        }
                            // for more than one top level li, add a
                            //  new menu div with 'menu/expand/collapse'
                            else if (lis.size() > 1) {
                                var menu = Y.Node.create(
                                    Y.IC.ManageTreeview.MENU_CONTAINER_TEMPLATE
                                );
                                menu.setContent(
                                    Y.IC.ManageTreeview.SHOW_MENU_TEMPLATE +
                                        ' | ' +
                                        Y.IC.ManageTreeview.EXPAND_TEMPLATE +
                                        ' | ' +
                                        Y.IC.ManageTreeview.COLLAPSE_TEMPLATE
                                );
                                ul.insert(menu, ul);
                                // add the treeview events
                                parent.one('span.treeview-menu-toggle').on(
                                    'click', 
                                    ul.treeviewLite._showMenu, 
                                    ul.treeviewLite
                                );
                                parent.one('span.treeview-expand').on(
                                    'click', 
                                    ul.treeviewLite._expandTree, 
                                    ul.treeviewLite,
                                    parent
                                );
                                parent.one('span.treeview-collapse').on(
                                    'click', 
                                    ul.treeviewLite._collapseTree, 
                                    ul.treeviewLite,
                                    parent
                                );
                            }
                        }
                    }, this);
                    // then select the correct tab from our state
                    var tab_index = e.target.get('state.st') || 0;
                    e.target.selectChild(Number(tab_index));
                    this.fire('manageFunctionDetail:tabsrendered');
                },

                /*
                 * if this widget is hidden, remove it's history
                 * variables.  This is only necessary because the tabs
                 * are contained in the detail widget, and are not
                 * hidden themselves when the detail widget gets
                 * hidden.  Would making this module a Widget_Parent
                 * solve this problem?  How to let the hide/show
                 * events trickle down to the contained widgets?
                 */
                _onVisibleChange: function (e) {
                    // Y.log('detail::_onVisibleChange');
                    if (this._tabs) {
                        if (e.newVal === false) {
                            this._tabs.hide();
                        }
                        else {
                            this._tabs.show();
                        }
                    }
                }
            }
        );

        Y.namespace("IC");
        Y.IC.ManageFunctionDetail = ManageFunctionDetail;
    },
    "@VERSION@",
    {
        requires: [
            "ic-manage-widget-function",
            "ic-manage-widget-tabview",
            "ic-manage-plugin-tabpanel"
        ]
    }
);
