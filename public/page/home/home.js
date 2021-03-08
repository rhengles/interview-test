!function(global) { global.Page.map['home'] = {
	template: null,
	setup: function() {
		var data = global.hiPlatformData;
		data.load();
		var dataAll = data.getAll().value;
		var dataLista = dataAll.data;
		global.log(' // page/home: after data.load()', {
			loading: data.loading.value,
			error: data.error.value,
			lista: typeof dataAll,
			listaKeys: Object.keys(dataAll).slice(0, 32),
			listaData: typeof dataLista,
			listaArr: dataLista instanceof Array,
			lista0cArr: dataLista[0].children instanceof Array,
			leavesTotal: dataAll.leavesTotal,
		});
		return {
			dataLoading: data.loading,
			dataError: data.error,
			dataLista,
			dataLoad: data.reload,
			onDataItemClick: function(item) {
				recurseBranchesList(dataLista, item);
			},
			getErrorMessage: global.getErrorMessage
		};
		function validaCdata(cdata) {
			if ( cdata.subSelected > cdata.subTotal ) {
				console.error('erro na contagem, tem mais sub selecionados que o total', cdata);
			} else if ( cdata.subSelected < 0 ) {
				console.error('erro na contagem, os sub selecionados são negativos', cdata);
			}
			if ( cdata.subPartial > cdata.subTotal ) {
				console.error('erro na contagem, tem mais subPartial selecionados que o total', cdata);
			} else if ( cdata.subPartial < 0 ) {
				console.error('erro na contagem, os subPartial selecionados são negativos', cdata);
			}
			if ( cdata.leavesSel > cdata.leaves ) {
				console.error('erro na contagem, tem mais leaves selecionados que o total', cdata);
			} else if ( cdata.leavesSel < 0 ) {
				console.error('erro na contagem, os leaves selecionados são negativos', cdata);
			}
			if ( cdata.leavesSel === cdata.leaves ) {
				if (
					cdata.subSelected !== cdata.subTotal ||
					cdata.subPartial !== 0
				) {
					console.error('leaves diz que tudo está selecionado mas o sub não', cdata);
					return;
				}
				return false;
			} else {
				if (
					cdata.subSelected === cdata.subTotal
				) {
					console.error('sub diz que tudo está selecionado mas o leaves não', cdata);
					return;
				}
				return true;
			}
		}
		function recurseBranchesList(list, itemClick, setSubLeavesSel) {
			var leaves = 0;
			var leavesSel = 0;
			var subTotal = 0;
			var subSelected = 0;
			var subPartial = 0;
			list.forEach(function(item) {
				// recurseBranchesItem(item, path)
				var isClicked = item === itemClick;
				var ch = item.children;
				if (ch && ch.length) {
					var cdata = recurseBranchesList(ch, itemClick, setSubLeavesSel);

					if (isClicked) {
						var subSel = validaCdata(cdata);
						if (null != subSel) {
							var cdata2 = recurseBranchesList(ch, itemClick, subSel);
							console.log('itemClicked changed', cdata, cdata2);
							cdata = cdata2;
						}
					}

					if (cdata.leavesSel === cdata.leaves) {
						subSelected += 1;
					} else if (cdata.leavesSel) {
						subPartial += 1;
					}
					subTotal += 1;
					leaves    += cdata.leaves;
					leavesSel += cdata.leavesSel;

					item.subTotal           = cdata.subTotal;
					item.subSelected        = cdata.subSelected;
					item.subPartialSelected = cdata.subPartial;
					item.leavesTotal        = cdata.leaves;
					item.leavesSelected     = cdata.leavesSel;
				} else {
					if (isClicked) {
						item.selfSelected = !item.selfSelected;
					} else if (null != setSubLeavesSel) {
						item.selfSelected = setSubLeavesSel;
					}
					var selfSel = item.selfSelected ? 1 : 0;
					subTotal += 1;
					subSelected += selfSel;
					leaves += 1;
					leavesSel += selfSel;
					item.subTotal           = 0;
					item.subSelected        = 0;
					item.subPartialSelected = 0;
					item.leavesTotal        = 0;
					item.leavesSelected     = 0;
				}
			});
			return {
				leaves,
				leavesSel,
				subTotal,
				subSelected,
				subPartial,
			};
		}
	}
}; }(_app$);
