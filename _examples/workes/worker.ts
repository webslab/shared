self.onmessage = (e) => {
	setTimeout(() => {
		console.log(e.data);
		self.close();
	}, 1000);
};
