import * as React from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/';
//import { Modal } from 'office-ui-fabric-react/lib/Modal';
import {IHyperModalProps,IHyperModalState} from '../Interfaces/HyperInterfaces';
import styles from './TtDemo.module.scss';

export default class HyperModal extends React.Component<IHyperModalProps, IHyperModalState> {
    constructor(props: IHyperModalProps, state: IHyperModalState) {
        super(props);    
        this.state = {
            
        };
    }

    public render(): React.ReactElement<IHyperModalProps> {
        return (
        <div>    
        { this.props.visible && 
            <div className={` ${styles.busyBarPlaceHolder}`}>
                <div className={` ${styles.busyBarOverlay} }` } />                        
                <div className={` ${styles.busyBar} `}>
                    <Spinner size={ SpinnerSize.large } label='Working on it...' />
                </div>                        
            </div>
        }
        </div>
        );
    }
}
