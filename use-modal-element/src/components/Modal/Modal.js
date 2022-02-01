import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import s from './Modal.module.css';

//Components
import CloseButton from '../CloseButton/CloseButton';
import ControlButton from '../ControlButton/ControlButton';

//Hooks
import useOnClickOutside from '../../hooks/useOnClickOutside';
import useBackgroundScroll from '../../hooks/useBackgroundScroll';

const useModal = (settings) => {
   //Refs
   const modalRef = useRef()

   // States
   const [opend, setOpend] = useState(false)

   //Default settings
   const {
      withBackground = {
         closable: true,
         scrollable: false,
      },
      withCloseButton = {
         type: 'default', // 'default', 'rounded', 'text'
         text: '',
         customClassName: '',
      },
      withControlButton = {
         type: 'default', // 'default', 'outlined', 'text'
         text: 'button',
         customClassName: '',
         action: () => { console.log('empty') }
      },
      additional = {
         customWrapperClassName: '',
         fullyShieldedMobile: true,
      }
   } = settings;

   //Handlers
   const toggleModal = () => setOpend(value => !value);
   const closeModal = () => setOpend(false)
   const openModal = () => setOpend(true)

   //Init 
   if (withBackground) {
      useOnClickOutside(modalRef, closeModal, withBackground.closable);
      useBackgroundScroll(opend, withBackground.scrollable);
   }

   const Modal = (props) => {
      return (opend && createPortal(
         <div
            className={classNames(s.backgroundInit, {
               [s.withBackground]: withBackground,
               [s.fullyShielded]: additional.fullyShieldedMobile
            })}>
            <div ref={modalRef}
               className={classNames(s.wrapper, additional.customWrapperClassName)}>
               {/* Modal's default styled close button */}
               {withCloseButton &&
                  <CloseButton handleAction={closeModal}
                     settings={withCloseButton}
                     fullScreen={additional.fullyShieldedMobile} />
               }

               {/* Modal's default styled title */}
               {props.title &&
                  <h2 className={classNames(s.title)}>{props.title}</h2>
               }

               {/* Modal's default styled subtitle */}
               {props.subtitle &&
                  <h2 className={classNames(s.subtitle)}>{props.subtitle}</h2>
               }

               {/* Modal's content */}
               <div className={s.wrapperInner}>
                  <div className={s.content}>
                     {props.children}
                  </div>
               </div>

               {/* Modal's default styled control button */}
               {withControlButton &&
                  <ControlButton settings={withControlButton} />
               }
            </div>
         </div>,
         document.getElementById('root'))
      );
   }

   return [Modal, openModal];
}


export default useModal;