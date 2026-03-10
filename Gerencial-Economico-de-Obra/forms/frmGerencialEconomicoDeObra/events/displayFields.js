function displayFields(form, customHTML) {
	form.setValue("atividade", getValue('WKNumState'));
	form.setValue("formMode", form.getFormMode());
	form.setValue("isMobile", form.getMobile());
	form.setValue("userCode", getValue("WKUser"));


	form.setHidePrintLink(true);
}