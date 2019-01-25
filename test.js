import {inject, NewInstance} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';
import {HttpClient, json} from 'aurelia-fetch-client';
import $ from 'jquery';
import {EventAggregator} from 'aurelia-event-aggregator';
import {BindingSignaler} from 'aurelia-templating-resources';
import { PSMAureliaCommon } from '../../components/common/psmaureliacommon';
import {Administration} from './administration';
import {SessionConfig} from '../../models/session-config';
import {Router} from 'aurelia-router';

@inject(I18N,EventAggregator,BindingSignaler,HttpClient, Router, SessionConfig)
export class showInterRef extends Administration {

	constructor(i18n,ea,signaler,http, router, sessionConfig){
		super();
		this.selectedOption="-1";
		this.selectedRow=null;
		this.i18n=i18n;
		this.sessionConfig = sessionConfig;
		this.router = router;
		this.filteredRefData=[];
		this.sortOrdering = {};
		this.ea = ea;

		setInterval(() => signaler.signal('my-signal'), 200);

		http.configure(config => {
            config
		        .withBaseUrl(this.baseUrl)
				.withDefaults({
                    headers: super.buildHeaderForJsonUtf8()
                })
                .withInterceptor({
                    request(request) {
						let payload={};
						ea.publish('session:update', payload);
                        return request;
                    }
                });
		});
		this.http = http;

		this.selectedHeaderRow = {
			id : 'refCode',
			columns : [
					 {
						 header : 'inter_ref_dt_col_item_code',
						 property : 'refCode',
						 display : '',
						 width : '10%',
						 text : true,
						 maxlength : 5,
						 size : 4
					 },
					 {
						 header : 'inter_ref_dt_col_label_fr',
						 property : 'refLabelFr',
						 display : '',
						 width : '35%',
						 text : true,
						 maxlength : 50,
						 size : 12
					 },
					 {
						 header : 'inter_ref_dt_col_label_en',
						 property : 'refLabelEn',
						 display : '',
						 width : '35%',
						 text : true,
						 maxlength : 50,
						 size : 12
					 },
					 {
						 header : 'inter_ref_dt_col_display_order',
						 property : 'refNb',
						 display : '',
						 width : '12%',
						 text : true,
						 maxlength : 9,
						 size : 3,
						 keydownFunction : (event) => this.isNumeric(event)
					 },
					 {
						 header : 'inter_ref_dt_col_active',
						 property : 'refItemStatus',
						 display : '',
						 width : '8%',
						 textalign : 'center',
						 verticalalign : 'middle',
						 checkbox : true
					 }
					],
			isDisabled : false,
			enabler : 'updatable'
		};

		this.datarow = {
			loadData : (page) ==> {
				this.loadData();
			},
			id : 'refCode',
			columns : [
					 {
						 header : 'inter_ref_dt_col_item_code',
						 property : 'refCode',
						 display : '',
						 width : '10%'
					 },
					 {
						 header : 'inter_ref_dt_col_label_fr',
						 property : 'refLabelFr',
						 display : '',
						 width : '20%'
					 },
					 {
						 header : 'inter_ref_dt_col_label_en',
						 property : 'refLabelEn',
						 display : '',
						 width : '20%'
					 },
					 {
						 header : 'inter_ref_dt_col_display_order',
						 property : 'refNb',
						 display : '',
						 width : '14%'
					 },
					 {
						 header : 'inter_ref_dt_col_active',
						 property : 'refItemStatus',
						 display : '',
						 width : '8%',
						 checkbox : true,
						 noSort : true
					 },
					 {
						 header : 'inter_ref_dt_col_update_on',
						 property : 'updateDateString',
						 display : '',
						 width : '14%'
					 },
					 {
						 header : 'inter_ref_dt_col_update_by',
						 property : 'refUpdateUser',
						 display : '',
						 width : '14%',
						 tooltip : 'hover'
					 }
					],
			height : '250px',
			isDisabled : true,
			selectedRowFunction : (row, index) => {this.selectedRowFunction(row, index);},
			selectedHeaderRowFunction : (col) => {this.selectedHeaderRowFunction(col);}
		};

	}

	detached(){
		this.subscription.dispose();
	}

	selectedRowFunction(row){
		this.selectedRow=JSON.parse("["+JSON.stringify(row)+"]");
	}

	selectedHeaderRowFunction(col){
		if(typeof this.sortOrdering.order === 'undefined') this.sortOrdering.order=1; //ascending

		if(this.sortOrdering.property===col.property){
			this.sortOrdering.order *= -1;
		} else {
			this.sortOrdering.property=col.property;
			this.sortOrdering.order = 1;
		}

		$("#sortState").remove();
		if(this.sortOrdering.order>0)
			$( '<span id="sortState" class="glyphicon glyphicon-chevron-up pull-right"></span>' ).appendTo( '#'+col.property );
		else if(this.sortOrdering.order<0)
			$( '<span id="sortState" class="glyphicon glyphicon-chevron-down pull-right"></span>' ).appendTo( '#'+col.property );
	}

	selectedOptionChange(){
		this.selectedRow=null;
	}

	activate(){
		//required by dropdown
		this.locale = this.i18n.getLocale().toLowerCase().replace(/^(.)|\s(.)/g,
								function($1) { return $1.toUpperCase(); });

		this.subscription = this.ea.subscribe('i18n:locale:changed', payload => {
			this.locale = this.i18n.getLocale().toLowerCase().replace(/^(.)|\s(.)/g,
								function($1) { return $1.toUpperCase(); });
	    });

		super.showPreparing();
		this.disableflag = false; //only admin should be able to modify anything in this screen

		let url = 'api/user/get-current-user?_t='+new Date().getTime();
		this.http.fetch(url)
			.then(response => response.json())
			.then(data => {
				this.session = data;
				this.disableflag = !this.session.roles.includes('ADMIN');
			});
		let url2= 'api/admin/interRef/init?_t='+new Date().getTime();
		return this.http.fetch(url2)
			.then(response => response.json())
			.then(data => {
				if(super.isResponseOkOrHandleError(data)){
					this.currentUT = data.currentUT;
					this.users = data.users;
					let userMap = [];
					let x  = '';
					for(let i=0; i<this.users.length; i++){
						x = this.users[i];

						if(x.utCode === this.currentUT){
							this.user=x;
						}
						if(x.firstName != null && x.lastName != null){
							userMap[x.utCode] = x.firstName + ' ' + x.lastName;
						}else{
							userMap[x.utCode] = this.i18n.tr('user_not_found_in_rcp');
						}
					}

					this.refData = data.refData;
					for(var i=0;i<this.refData.length;i++){
						this.refData[i].refItemStatus = this.refData[i].refItemStatus==='A'?true:false;
						this.refData[i].hover = [userMap[this.refData[i].refUpdateUser]];

					}
					this.refMaster = data.refMaster;
					this.currentDate = data.currentDate;

					super.loadingDone();
				}
			}).catch(error => {
				super.handleCatchedException(error, url2);
			});
	}

	isNumeric(event){
		return super.isNumberKey(event);
	}

	save(){
		if(super.validateSaveReferential()){
			super.showProcessing();

			 let url = 'api/admin/interRef/save-referential';
			 this.http.fetch(url, {
					method : 'POST',
					headers : super.buildHeaderForJsonUtf8(),
					body: JSON.stringify({
						"id" : this.selectedRow[0].id,
						"refType" : this.selectedRow[0].refType,
						"refCode" : this.selectedRow[0].refCode,
						"refLabelFr" : this.selectedRow[0].refLabelFr,
						"refLabelEn" : this.selectedRow[0].refLabelEn,
						"refNb" : this.selectedRow[0].refNb,
						"refItemStatus" : this.selectedRow[0].refItemStatus ? 'A' : null
			 		})
				})
				.then(response => response.json())
				.then(data => {
					if(super.isResponseOkOrHandleError(data)){
						super.loadingDone();
						var exist=false;
						for(var i=0;i<this.refData.length;i++)
							if(this.refData[i].id===this.selectedRow[0].id){
								this.selectedRow[0].refUpdateUser = this.currentUT;
								this.selectedRow[0].updateDateString = this.currentDate;
								this.refData.splice(i,1,JSON.parse(JSON.stringify(this.selectedRow[0])));
								exist=true;
								break;
							}
						if(!exist){
							this.selectedRow[0].id=data.rowdata;
							this.selectedRow[0].refUpdateUser = this.currentUT;
							this.selectedRow[0].updateDateString = this.currentDate;
							this.refData.push(JSON.parse(JSON.stringify(this.selectedRow[0])));
						}
					}
				}).catch(error => {
					super.handleCatchedException(error, url);
				});
		}
	}

	addNew(){
		if(super.checkParentReferentialSelected()){

			this.selectedRow=[{
				id:'',
				refType:this.selectedOption,
				refCode:'',
				refLabelFr:'',
				refLabelEn:'',
				refNb:'',
				refItemStatus:true,
				updatable:true
			}];
		}
	}
}
