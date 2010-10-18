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
    "ic-form",
    function(Y) {
        var Form;

        Form = function (config) {
            Y.log("form constructor: " + Y.dump(config));

            if (config && ! config.fields) {
                //
                // doing this here so that we can automatically set up fields
                // attribute value by munging the config before the Base.init()
                // gets a hold of it because gallery-form won't allow you to
                // late set the fields attribute
                //

                // parse the pk into _pk_fields for finding an object on the 
                // server side
                var _pk_fields = [];
                if (config.pk) {
                    Y.log("form constructor - pk: " + Y.dump(config.pk));
                    Y.each(
                        config.pk,
                        function (v) {
                            if (Y.Lang.isValue(v.field) && Y.Lang.isValue(v.value)) {
                                _pk_fields.push(
                                    {
                                        name:  v.field,
                                        value: v.value,
                                        type: 'hidden'
                                    }
                                );
                            }
                        }
                    );
                }

                //
                // make an array of hidden fields for each 'present field',
                // this instructs the server side what fields to expect,
                // which it will use to determine which controls are presnet
                // and to build the value out of the controls for the given
                // field, the simple case being 1 control where the value is
                // taken directly from the form
                //
                var _fields_present = [];
                if (config.fields_present) {
                    Y.log("form constructor - fields_present: " + Y.dump(config.fields_present));
                    Y.each(
                        config.fields_present,
                        function (v) {
                            _fields_present.push(
                                {
                                    name: 'fields_present[]',
                                    value: v,
                                    type: 'hidden'
                                }
                            );
                        }
                    );
                }

                var _controls = [];
                if (config.field_defs) {
                    Y.log("form constructor - field_defs: " + Y.dump(config.field_defs));
                    Y.each(
                        config.field_defs,
                        function (field_def, fdi, fda) {
                            Y.each(
                                field_def.controls,
                                function (control, i, a) {
                                    Y.log("control label: " + Y.dump(control["label"]));
                                    if (! Y.Lang.isValue(control["label"])) {
                                        // TODO: should this check to see if we've already used the field def label?
                                        if (i === 0) {
                                            control.label = field_def.label;
                                        }
                                        else {
                                            control.label = "";
                                        }
                                    }

                                    var field_class;

                                    // TODO: are both of these checks still needed?
                                    if (control.ic_override_type) {
                                        Y.log("form constructor - each: " + control.ic_override_type);
                                        try {
                                            field_class = Y.IC.FormField[control.ic_override_type] || Y[control.ic_override_type];
                                            Y.log("form constructor - field_class: " + field_class);

                                            if (Y.Lang.isFunction(field_class)) {
                                                control.type = field_class;
                                            }
                                        }
                                        catch (err) {
                                            Y.log("Can't test control for field_class (" + control.ic_override_type + "): " + err, "error");
                                        }
                                    }
                                    else {
                                        Y.log("form constructor - each: " + control.type);
                                        try {
                                            field_class = Y.IC[control.type] || Y[control.type];
                                            Y.log("form constructor - field_class: " + field_class);

                                            if (Y.Lang.isFunction(field_class)) {
                                                control.type = field_class;
                                            }
                                        }
                                        catch (err) {
                                            Y.log("Can't determine field class from control (" + control + "): " + err, "error");
                                        }
                                    }

                                    _controls.push(control);
                                }
                            );
                        }
                    );
                }

                var _buttons = [];
                if (config.buttons) {
                    _buttons = config.buttons;
                }
                else if (! config.no_buttons) {
                    var _buttons  = [
                        {
                            name:  'submit',
                            label: 'Submit',
                            type:  'submit'
                        },
                        {
                            name:  'reset',
                            label: 'Reset',
                            type:  'reset'
                        }
                    ];
                }

                var fields = [].concat(
                    _pk_fields,
                    _fields_present,
                    _controls,
                    _buttons
                );

                Y.log("form constructor - fields: " + Y.dump(fields));
                config.fields = fields;
            }

            Form.superclass.constructor.apply(this, arguments);
        };

        Y.mix(
            Form,
            {
                NAME:  "ic_form",
                ATTRS: {}
            }
        );

        Y.extend(
            Form,
            Y.Form,
            {
                initializer: function (config) {
                    Y.log("form::initializer");


                    this.on('success', Y.bind(this._onFormSuccess, this));
                    this.on('successful_response', Y.bind(this._onSuccessfulResponse, this));
                    this.on('failure', Y.bind(this._onFormFailure, this));
                    this.on('failed_response', Y.bind(this._onFailedResponse, this));

                    // subscribe to the custom event our form wrapper provides
                    this.on("ic_form_reset", Y.bind(this._onReset, this));
                },

                reset: function (bool, e) {
                    Y.log("form::reset");

                    if (e) {
                        // this halts the click event that triggered us so that plugins 
                        // can set up a new event subscription for a click (in particular
                        // the edit in place plugin)
                        Y.log("form::reset halting event: " + e.type);
                        try {
                            e.halt();
                        }
                        catch (err) {
                            Y.log("Can't halt click event in form::reset: " + err + "(" + e + ")", "error");
                        }
                    }

                    Form.superclass.reset.apply(this, arguments);

                    // fire an event so that plugins can pick up on the reset action
                    // to do re-installation of the click event, etc.
                    Y.log("form::reset - firing ic_form_reset");
                    this.fire("ic_form_reset");
                },

                _onReset: function (e) {
                    Y.log("form::_onReset");
                },

                _onFormSuccess: function (e) {
                    Y.log('form::_onFormSuccess');
                    var response, host;
                    try {
                        response = Y.JSON.parse(e.response.responseText);
                    }
                    catch (err) {
                        Y.log("Can't parse JSON: " + err, "error");
                        //Y.log(e);

                        this._onFormFailure("Can't parse JSON response: " + err);

                        return;
                    }
                    try {
                        e.halt();
                    }
                    catch (err) {
                        Y.log("Can't halt event on form success: " + err, "error");
                    }

                    if (response.code === 1) {
                        this.fire("successful_response", response);
                    }
                    else {
                        this._onFormFailure(response);
                    }
                },

                _onSuccessfulResponse: function (e) {
                    Y.log('form::_onSuccessfulResponse');
                    var response = e.details[0];
                    Y.log('form::_onSuccessfulResponse - response: ' + Y.dump(response));

                    var form = this;

                    // TODO: this could be optimized by setting up a local object to get a form
                    //       field by name so that we would only loop the form fields once
                    Y.each(
                        response.value.fields,
                        function (v, k, obj) {
                            if (v.controls_to_update && v.controls_to_update.length) {
                                Y.each(
                                    v.controls_to_update,
                                    function (control, i, a) {
                                        Y.log("Updating control: " + control.name + " => " + control.value);
                                        Y.each(
                                            form.get("fields"),
                                            function (field, fi, fa) {
                                                if (field.get("name") === control.name) {
                                                    Y.log("Setting field value: " + field.get("name"));
                                                    field.set("value", control.value);
                                                }
                                            }
                                        );
                                    }
                                );
                            }
                        }
                    );
                },

                _onFormFailure: function (e) {
                    Y.log('form::_onFormFailure');

                    this.fire("failed_response", response);
                },

                _onFailedResponse: function (e) {
                    Y.log('form::_onFailedResponse');
                    Y.log('form::_onFailedResponse - e: ' + e);

                    // TODO: need to pull response out of e

                    if (e.exception) {
                        Y.log("form::_onFormFailure: Exception: " + e.exception);
                    }
                    else {
                        Y.log("form::_onFormFailure: Error: " + e);
                    }
                }
            }
        );

        Y.augment(Form, Y.Plugin.Host);

        Y.namespace("IC");
        Y.IC.Form = Form;
    },
    "@VERSION@",
    {
        requires: [
            "pluginhost",
            "gallery-form"
        ]
    }
);