import Highcharts from 'highcharts';
import { getDataAPI } from './../util/fetchAPI';

const renderDashboard = async () => {
	const { data } = await getDataAPI('order/income');
	console.log(data);
	let ax = [],
		yx = [],
		data1 = [],
		data2 = [];
	data.forEach((item) => {
		ax.push(item._id);
		data1.push(item.total);
		data2.push(item.numberOrder);
	});
	const chart = Highcharts.chart('container', {
		title: {
			text: 'Tổng quan',
		},
		chart: {
			zoomType: 'x',
		},
		xAxis: {
			categories: ax,
		},
		yAxis: [
			{
				title: {
					text: 'Tổng số tiền',
				},
			},
			{
				opposite: true,
				title: {
					text: 'Số đơn hàng',
				},
			},
		],
		series: [
			{
				yAxis: 0,
				type: 'column',
				name: 'Số tiền đã nhận',
				data: data1,
			},
			{
				yAxis: 1,
				type: 'line',
				name: 'Số đơn hàng',
				data: data2,
			},
		],
		plotOptions: {
			column: {
				/* Here is the setting to limit the maximum column width. */
				maxPointWidth: 50,
			},
			area: {
				fillColor: {
					linearGradient: {
						x1: 0,
						y1: 0,
						x2: 0,
						y2: 1,
					},
					stops: [
						[0, Highcharts.getOptions().colors[0]],
						[
							1,
							Highcharts.color(Highcharts.getOptions().colors[0])
								.setOpacity(0)
								.get('rgba'),
						],
					],
				},
				marker: {
					radius: 2,
				},
				lineWidth: 1,
				states: {
					hover: {
						lineWidth: 1,
					},
				},
				threshold: null,
			},
		},
	});
};

export { renderDashboard };
