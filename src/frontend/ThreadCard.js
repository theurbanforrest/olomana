import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import * as THEME from '../constants/theme';

const ThreadCard = (props) => (

	<Col lg="12" styles={THEME.THREAD_CARD}>
		<Row>
			{/** badge **/}
				<Col lg="3" xs="3">
					<Image src={props.thumbnailUrl} fluid />
				</Col>
			{/** info **/}
				<Col lg="9" xs="9">
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