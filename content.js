(function(){
	productsStatuses = {}
	statusColors = {
		'outdated' : '#AA0D23',
		'caution' : '#cc960e',
		'updated' : '#66BC00',
		'none' : '#808080'
	}

	$.ajax({
		type: 'GET',
		url: 'https://buyersguide.macrumors.com',
		crossdomain: true,
		dataType: 'html',
		success: function(data) {
			$(".row.product div.right", data).each(function(){
				var device = $("h2", this).text().toLowerCase().replace(/\d+\.\d" /, "")
				var status = $(".status", this)
				var message = $(status).text().replace($('strong', status).text(), '')
				statusTypeParts = status.attr('class').split(' ')

				var statusType = 'none'
				for (var i = 0; i < statusTypeParts.length; i++) {
					if (statusColors[statusTypeParts[i]]) {
						statusType = statusTypeParts[i]
						break
					}
				}
				productsStatuses[device] = [statusType, message]
			})
			updateWebsite()
		}
	})


	function updateWebsite() {
		
		//Configuration for headers in detail and purchase
		$('.ac-ln-title a, .localnav-header a').each(function(){
			console.log($(this).text())
			var productStatus = getProductStatus($(this).text())
			var statusColor = statusColors[productStatus[0]]
			var message = productStatus[1]
			$(this).css({
				'backgroundColor' : statusColor,
				'color' : 'white',
				'padding' : '3px 10px',
				'border-radius' : '5px',
				'font-weight' : 'bold'
			})
			$(this).parent().append(
				$('<span>')
				.css({
					'color' : statusColor,
					'white-space': 'pre-wrap',
					'font-size' : '12px',
					'font-family' : '"Myriad Set Pro", "Helvetica Neue", Helvetica, Arial'
				})
				.text(message)
			)
		})

		//Configuration for item carousels
		$('span.chapternav-label').each(function(){
			var productStatus = getProductStatus($(this).text())
			if (productStatus) {
				var statusColor = statusColors[productStatus[0]]
				var message = productStatus[1]
				$(this).css({
						'backgroundColor' : statusColor,
						'color' : 'white',
						'padding': '1px 5px',
						'font-weight': 'bold',
						'border-radius': '5px'
					})
					$(this).parent().find('.chapternav-new').remove()
					$(this).parent().append(
						$('<span>')
						.css({
							'color' : statusColor,
							'white-space': 'pre-wrap',
						})
						.attr('class', 'chapternav-new')
						.text(message)
					)
			}
		})
	}

	function getProductStatus(rawProductName) {
		var product = replaceNbsps(rawProductName.trim().toLowerCase())

		if (product.includes('ipad mini')) {
			product = 'ipad mini' //Fix for ipad mini
		} else if (product != 'iphone se' && product.includes('iphone')) {
			product = 'iphone' //Fix for iphone 7, 6s
		} else if (product.includes('apple watch')) {
			product = 'apple watch' //Fix for apple watch
		}

		return productsStatuses[product]
	}

	function replaceNbsps(str) {
	var re = new RegExp(String.fromCharCode(160), "g");
	return str.replace(re, " ");
	}
})()

