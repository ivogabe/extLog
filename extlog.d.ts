declare module "extlog" {
	class ExtLog {
		constructor(name : string, color: string);

		debug(...msg : any[]);
		info(...msg : any[]);
		counter(...msg : any[]);
		warning(...msg : any[]);
		error(...msg : any[]);
		fatal(...msg : any[]);

		getCounter(title : string, time : number) : ExtLog.Counter;

		setMinLevel(level : any);
		static setMinLevel(level : any)
		static color : any;
		static levels : any;
	}
	module ExtLog {
		interface Counter {
			add();
		}
	}
	export = ExtLog
}