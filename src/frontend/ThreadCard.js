import React from 'react';
import { Row, Col } from 'react-bootstrap';
import * as THEME from '../constants/theme';

const ThreadCard = (props) => (

	<Col lg="12" styles={THEME.THREAD_CARD}>
		<Row>
			{/** badge **/}
				<Col lg="1" xs="2">
				</Col>
			{/** info **/}
				<Col lg="11" xs="10">
					<h5>
						<strong>{props.headline}</strong>
					</h5>
					<h6><strong>{props.price}</strong></h6>
					<p>{props.body}...
						<a href={props.viewUrl}>View</a>
					</p>
				</Col>
		</Row>
	</Col>
)

export default ThreadCard;