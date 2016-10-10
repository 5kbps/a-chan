loadSettings();

function init(){
	var callQuery = [
	highlightPostInURL,
	saveScrollPosition,
	saveAppliedStyle,
	doSpoilers,
	updatePostCache,
	watchBoard,
	translateUI,
	addNavEvents,
	formatTime,
	addRefs,
	addShowPostEvents,
	hideHidden,
	insertPasswords,
	YouTube.init,
	startAutoUpdateTick,
	checkForNewPosts,
	updateTitle,
	insertPreferences,
	]
	if(!getSetting('noinit')){
		var timing = []
		var report = []
		var errors = []
		callQuery.map(function(f){
			timing.push(Date.now())
			if(getSetting('unsafe_init')){
				f()
			}else{
				try{
					f()
				}catch(e){
					errors.push('Error ' + e.name + ":" + e.message + "\n" + e.stack+'\n')
				}
			}
		})
		var execTime = timing[timing.length - 1] - timing[0]
		if(errors.length || execTime > config.max_script_execution_time){
			report.push('Useragent: ' + navigator.userAgent + '\n')
			report.push(errors)
			report.push(timing)
			askForBugReport(report)
		}
	}
}

document.addEventListener("DOMContentLoaded", init)
window.addEventListener('hashchange', highlightPostInURL)