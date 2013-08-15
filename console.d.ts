
declare class extlog {
	constructor(name : string, color: string);
	
	debug(title : string, msg? : string);
	info(title : string, msg? : string);
	counter(title : string, msg? : string);
	warning(title : string, msg? : string);
	error(title : string, msg? : string);
	fatal(title : string, msg? : string);
	
	getCounter(title : string, time : number) : Counter;
	
	setMinLevel(level : any);
	static setMinLevel(level : any)
	static color : any;
	static levels : any;
}

interface Counter {
	add();
}

declare module "extlog" {}