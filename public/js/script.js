$(document).on("scroll", () => {

	if($(document).scrollTop()>100) {
		$(".header").addClass("small");
	} else {
		$(".header").removeClass("small");
	}

});
