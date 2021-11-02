import '../styles/MainPage.css'
import * as IO from '../../models/SOCKET_IO_CONTANTS'

import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import Matrix from './matrix'
import SettingsPage from './settings'
import { IDiscoveredNdiSource, ISource, ITarget } from '../../models/interfaces'

export const socketClient = io()

const MainPage = () => {
    const [showSettings, setShowSettings] = useState<boolean>(false)
    const [targets, setTargets] = useState<ITarget[]>([])
    const [sources, setSources] = useState<ISource[]>([])
    const [discoveredNdiSources, setDiscoveredNdiSources] = useState<
        IDiscoveredNdiSource[]
    >([])

    useEffect(() => {
        socketClient
            .on('connect', () => {
                console.log('Connected to NDI-MTX')
            })
            .on(
                IO.UPDATE_CLIENT,
                (
                    sourceList: ISource[],
                    targetList: ITarget[],
                    discoveredNdiSourcesList: IDiscoveredNdiSource[]
                ) => {
                    console.log(
                        'Source List: ',
                        sourceList,
                        'Target List :',
                        targetList,
                        'Discovered NDI sources :',
                        discoveredNdiSourcesList
                    )
                    setSources(sourceList)
                    setTargets(targetList)
                    setDiscoveredNdiSources(discoveredNdiSourcesList)
                }
            )
    }, [socketClient])

    const handleShowSettings = () => {
        setShowSettings(!showSettings)
    }

    return (
        <React.Fragment>
            <div className={'container'}>
                <div className={'header'}>NDI CONTROLLER</div>
            </div>
            {!showSettings ? (
                <React.Fragment>
                    <Matrix sources={sources} targets={targets} />
                    <div className="container">
                    <button
                        className="foot-settings"
                        onClick={() => {
                            handleShowSettings()
                        }}
                    >
                        SETTINGS
                    </button>
                    </div>
                </React.Fragment>
            ) : (
                <SettingsPage
                    sources={sources}
                    targets={targets}
                    discoveredNdiSources={discoveredNdiSources}
                    setSources={setSources}
                    handleShowSettings={handleShowSettings}
                />
            )}
            <div className="foot-ndi">
                NDI® is a registered trademark of NewTek, Inc.: http://ndi.tv/
            </div>
        </React.Fragment>
    )
}

export default MainPage
