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

  	const {
  		activePage,
  		fullQuerySize,
  		debug
  	} = this.props;

  	return(
  		
  		<div>
  			{debug &&
  				<p>fullQuerySize is {fullQuerySize}</p>
  			}
	    	<h5>Page Selector</h5>
      		<div>
		      	<h6>
		     		<table>
		     			<tr>
					      	{previous.map(obj => (
				      			<td>
				      				<a href={`/threads?page=${obj.pageNum}`}>
				        				{obj.pageNum}
				        			</a>
				        		</td>
					        ))}
					      	<td><strong> {activePage} </strong></td>
					        {next.map(obj => (
				      			<td>
				      				<a href={`/threads?page=${obj.pageNum}`}>
				        				{obj.pageNum}
				        			</a>
				        		</td>
					        ))}
				        </tr>
			        </table>
		        </h6>
	        </div>
	    </div>
  		
  	)
  }
}

export default PageSelector;