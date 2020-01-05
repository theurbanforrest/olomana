import React, { Component } from 'react';

class PageSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	next: [],
    	previous: []
    }
  }

  componentDidMount() {

  	const activePage = parseInt(this.props.activePage);
  	const pageSize = parseInt(this.props.pageSize);  
  	const fullQuerySize = parseInt(this.props.fullQuerySize);
  	const lastPage = Math.ceil(fullQuerySize / pageSize);

  	let next = [];
  	let previous = [];

  	//Set Previous 5
	  	for(let k=1;k<activePage;k++){

	  		previous.push({
	  			pageNum: k
	  		})
	  	}

	 //Set Next 5
	  	for(let i=activePage+1;i<=lastPage;i++){

	  			next.push({
	  			pageNum: i
	  		})
	  	}

	this.setState({
		next: next,
		previous: previous
	})

  }

  render(){
  	const {
  		next,
  		previous
  	} = this.state;

  	let activePage = this.props.activePage;
    let fullQuerySize = this.props.fullQuerySize;

  	return(
  		
  		<div>
	    	<h5>Page Selector</h5>
      		<div>
		      	<p> Full query is {fullQuerySize} </p>
		      	<h6> Previous </h6>
		      	{previous.map(obj => (
		        	<li key={obj.pageNum}>
		        		{
			        		/// <Link /> does not work because
			        		/// it does not reload the page.  Using vanilla HTML's <a/>
			        		//  does the job.  Future: improve this.
			        		//
		        		}
		        		<a href={`/threads?page=${obj.pageNum}`}>
		        			Page {obj.pageNum}
		        		</a>
		        	</li>
		        ))}

		        <h6> Active </h6>
		      	Active Page is {activePage}

		      	<h6> Next </h6>
		        {next.map(obj => (
		        	<li key={obj.pageNum}>
		        		<a href={`/threads?page=${obj.pageNum}`}>
		        			Page {obj.pageNum}
		        		</a>
		        	</li>
		        ))}
	        </div>
	    </div>
  		
  	)
  }
}

export default PageSelector;