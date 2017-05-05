console.log($('title').text())

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
	console.log(productsStatuses)
	var labels = $('span.chapternav-label').each(function(){
		var product = replaceNbsps($(this).text().toLowerCase())

		if (product.includes('ipad mini')) {
			product = 'ipad mini' //Fix for ipad mini
		} else if (product != 'iphone se' && product.includes('iphone')) {
			product = 'iphone' //Fix for iphone 7, 6s
		} else if (product.includes('apple watch')) {
			product = 'apple watch' //Fix for apple watch
		}

		console.log(product)

		var status = productsStatuses[product]
		if (status) {
			var message = status[1]
			var statusType = status[0]
			var statusColor = statusColors[statusType] || 'none'
			if (statusColor != 'none') {
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
		}
	})
}

function replaceNbsps(str) {
  var re = new RegExp(String.fromCharCode(160), "g");
  return str.replace(re, " ");
}